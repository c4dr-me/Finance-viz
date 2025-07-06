'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';

// Transaction type
export type Transaction = {
  _id: string;
  amount: number;
  description: string;
  date: string;
  category?: string;
  type: 'income' | 'expense';
  createdAt: string;
  updatedAt: string;
};

// Context type
interface TransactionContextType {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  addTransaction: (transactionData: {
    amount: number;
    description: string;
    date: string;
    category?: string;
    type: 'income' | 'expense';
  }) => Promise<{ success: boolean; error?: string; transaction?: Transaction }>;
  updateTransaction: (id: string, transactionData: {
    amount: number;
    description: string;
    date: string;
    category?: string;
    type: 'income' | 'expense';
  }) => Promise<{ success: boolean; error?: string; transaction?: Transaction }>;
  deleteTransaction: (id: string) => Promise<{ success: boolean; error?: string }>;
  refetch: () => Promise<void>;
}

// Create context
const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

// Hook to use the context
export const useTransactionsContext = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactionsContext must be used within a TransactionProvider');
  }
  return context;
};

// Provider component
export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { socket, isConnected } = useSocket();

  // Fetch all transactions
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      
      if (data.success) {
        setTransactions(data.transactions);
      } else {
        setError(data.error || 'Failed to fetch transactions');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new transaction
  const addTransaction = useCallback(async (transactionData: {
    amount: number;
    description: string;
    date: string;
    category?: string;
    type: 'income' | 'expense';
  }) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        return { success: true, transaction: data.transaction };
      } else {
        return { success: false, error: data.error };
      }
    } catch {
      return { success: false, error: 'Network error' };
    }
  }, []);

  // Delete transaction
  const deleteTransaction = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch {
      return { success: false, error: 'Network error' };
    }
  }, []);

  // Update transaction
  const updateTransaction = useCallback(async (id: string, transactionData: {
    amount: number;
    description: string;
    date: string;
    category?: string;
    type: 'income' | 'expense';
  }) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return { success: true, transaction: data };
      } else {
        return { success: false, error: data.error };
      }
    } catch {
      return { success: false, error: 'Network error' };
    }
  }, []);

  useEffect(() => {
    if (!socket || !isConnected) {
      return;
    }

    const handleTransactionUpdate = (updateData: {
      action: 'created' | 'updated' | 'deleted';
      transaction: Transaction;
    }) => {
      const { action, transaction } = updateData;
      
      if (action === 'created') {
        setTransactions(prev => {
          const exists = prev.some(t => t._id === transaction._id);
          if (exists) {
            return prev;
          }
          return [transaction, ...prev];
        });
      } else if (action === 'deleted') {
        setTransactions(prev => prev.filter(t => t._id !== transaction._id));
      } else if (action === 'updated') {
        setTransactions(prev => prev.map(t => 
          t._id === transaction._id ? transaction : t
        ));
      }
    };

    socket.on('transaction-update', handleTransactionUpdate);

    return () => {
      socket.off('transaction-update', handleTransactionUpdate);
    };
  }, [socket, isConnected]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const value: TransactionContextType = {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

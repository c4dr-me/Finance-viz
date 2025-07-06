'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import pusherClient from '@/lib/pusherClient';

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

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransactionsContext = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactionsContext must be used within a TransactionProvider');
  }
  return context;
};

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
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
      if (showLoading) setLoading(false);
    }
  }, []);

  const addTransaction = useCallback(async (transactionData: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData),
      });
      const data = await response.json();
      if (data.success) {
        await fetch('/api/transactions/trigger', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transaction: data.transaction }),
        });
        return { success: true, transaction: data.transaction };
      } else {
        return { success: false, error: data.error };
      }
    } catch {
      return { success: false, error: 'Network error' };
    }
  }, []);

  const updateTransaction = useCallback(async (id: string, transactionData: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData),
      });
      const data = await response.json();
      if (response.ok) {
        await fetch('/api/transactions/trigger', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transaction: data }),
        });
        return { success: true, transaction: data };
      } else {
        return { success: false, error: data.error };
      }
    } catch {
      return { success: false, error: 'Network error' };
    }
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        await fetch('/api/transactions/trigger', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transaction: { _id: id } }),
        });
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch {
      return { success: false, error: 'Network error' };
    }
  }, []);

  useEffect(() => {
    if (!pusherClient) return;
    const channel = pusherClient.subscribe('transactions');
    const handleUpdate = () => {
      fetchTransactions(false); 
    };
    channel.bind('updated', handleUpdate);
    return () => {
      channel.unbind('updated', handleUpdate);
      if (pusherClient) {
        pusherClient.unsubscribe('transactions');
      }
    };
  }, [fetchTransactions]);

  useEffect(() => {
    fetchTransactions(true); 
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

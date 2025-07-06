'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Budget types
export interface Budget {
  _id: string;
  categoryName: string;
  amount: number;
  month: number;
  year: number;
  spent?: number;
  remaining?: number;
  percentageUsed?: number;
  isOverBudget?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BudgetContextType {
  budgets: Record<string, number>;
  setBudgets: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  saveBudget: (categoryName: string, amount: number) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [budgets, setBudgets] = useState<Record<string, number>>({
    'Food & Dining': 500,
    'Transportation': 300,
    'Entertainment': 200,
    'Shopping': 400,
    'Healthcare': 150,
    'Bills & Services': 250,
    'Housing': 800,
    'Coffee & Snacks': 100,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load budgets from API on mount
  useEffect(() => {
    const loadBudgets = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        
        const response = await fetch(`/api/budgets?month=${month}&year=${year}`);
        const data = await response.json();
        
        if (data.success && data.budgets.length > 0) {
          const budgetRecord: Record<string, number> = {};
          data.budgets.forEach((budget: Budget) => {
            budgetRecord[budget.categoryName] = budget.amount;
          });
          setBudgets(budgetRecord);
        }
      } catch {
        setError('Failed to load budgets');
      } finally {
        setLoading(false);
      }
    };

    loadBudgets();
  }, []);

  // Save individual budget
  const saveBudget = async (categoryName: string, amount: number): Promise<boolean> => {
    try {
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryName,
          amount,
          month,
          year
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        // Update local state immediately
        setBudgets(prev => ({
          ...prev,
          [categoryName]: amount
        }));
        return true;
      } else {
        setError(data.error);
        return false;
      }
    } catch (err) {
      console.error('Error saving budget:', err);
      setError('Failed to save budget');
      return false;
    }
  };

  const value: BudgetContextType = {
    budgets,
    setBudgets,
    saveBudget,
    loading,
    error,
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudgetContext(): BudgetContextType {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudgetContext must be used within a BudgetProvider');
  }
  return context;
}

"use client";

import { useMemo } from "react";
import { getCategoryById } from "@/lib/categories";
import { Transaction } from "./useTransactionContext";

export function useDashboardAnalytics(transactions: Transaction[], budgets: Record<string, number>, categoryFilter: 'all' | 'expense' | 'income') {
  return useMemo(() => {
    // Safety check for undefined transactions
    const safeTransactions = transactions || [];
    
    const totalIncome = safeTransactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    const totalExpenses = safeTransactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    const netBalance = totalIncome - totalExpenses;

    // Current month data
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthTransactions = safeTransactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
    });

    const monthlyIncome = currentMonthTransactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    const monthlyExpenses = currentMonthTransactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    // Category breakdown with budget tracking
    const categoryTotals: Record<string, number> = {};
    const monthlySpending: Record<string, number> = {};
    
    // Calculate total spending per category (filtered by type)
    const filteredTransactions = categoryFilter === 'all' 
      ? safeTransactions 
      : safeTransactions.filter(tx => tx.type === categoryFilter);
      
    filteredTransactions.filter(tx => tx.type === 'expense').forEach((tx) => {
      // Convert category ID to category name if needed
      const categoryInfo = getCategoryById(tx.category || '');
      const cat = categoryInfo ? categoryInfo.name : (tx.category || "Uncategorized");
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Math.abs(tx.amount);
    });

    // Also include income categories if showing all or income
    if (categoryFilter === 'all' || categoryFilter === 'income') {
      filteredTransactions.filter(tx => tx.type === 'income').forEach((tx) => {
        const categoryInfo = getCategoryById(tx.category || '');
        const cat = categoryInfo ? categoryInfo.name : (tx.category || "Income");
        categoryTotals[cat] = (categoryTotals[cat] || 0) + Math.abs(tx.amount);
      });
    }

    // Calculate current month spending per category
    currentMonthTransactions.filter(tx => tx.type === 'expense').forEach((tx) => {
      // Convert category ID to category name if needed
      const categoryInfo = getCategoryById(tx.category || '');
      const cat = categoryInfo ? categoryInfo.name : (tx.category || "Uncategorized");
      monthlySpending[cat] = (monthlySpending[cat] || 0) + Math.abs(tx.amount);
    });

    const topCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    // Budget analysis
    const budgetAnalysis = Object.entries(budgets).map(([category, budget]) => {
      const spent = monthlySpending[category] || 0;
      const percentage = budget > 0 ? (spent / budget) * 100 : 0;
      const remaining = budget - spent;
      const status = percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good';
      
      return {
        category,
        budget,
        spent,
        remaining,
        percentage,
        status
      };
    }).sort((a, b) => b.percentage - a.percentage);

    const totalBudget = Object.values(budgets).reduce((sum, budget) => sum + budget, 0);
    // Calculate total spent this month (all expenses, not just budgeted ones)
    const totalSpent = monthlyExpenses;
    const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    // Recent transactions (last 3)
    const recentTransactions = [...safeTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);

    // Savings rate
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    return {
      totalIncome,
      totalExpenses,
      netBalance,
      monthlyIncome,
      monthlyExpenses,
      topCategories,
      recentTransactions,
      savingsRate,
      transactionCount: safeTransactions.length,
      budgetAnalysis,
      totalBudget,
      totalSpent,
      budgetUtilization,
      monthlySpending,
      categoryTotals
    };
  }, [transactions, budgets, categoryFilter]);
}

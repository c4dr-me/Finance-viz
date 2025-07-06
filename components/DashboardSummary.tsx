"use client";

import { useState } from "react";
import { useTransactionsContext } from "@/hooks/useTransactionContext";
import { useBudgetContext } from "@/hooks/useBudgetContext";
import { useDashboardAnalytics } from "@/hooks/useDashboardAnalytics";
import { 
  MetricsGrid, 
  BudgetOverview, 
  CategoryAnalysis, 
  SpendingInsights, 
  BudgetEditor, 
  WelcomeCard 
} from "@/components/dashboard";

export function DashboardSummary() {
  const { transactions } = useTransactionsContext();
  const { budgets } = useBudgetContext();
  
  const [showBudgetEditor, setShowBudgetEditor] = useState(false);
  const [chartType, setChartType] = useState<'area' | 'pie'>('area');

  const analytics = useDashboardAnalytics(transactions, budgets, 'all');

  const isFirstTimeUser = transactions.length === 0;

  if (isFirstTimeUser) {
    return (
      <div className="w-full space-y-6 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-100">Financial Overview</h2>
        </div>
        <WelcomeCard />
      </div>
    );
  }

  return (
    <div key={`dashboard-${transactions.length}-${analytics.totalIncome}-${analytics.totalExpenses}`} className="w-full space-y-6 mb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-100">Financial Overview</h2>
      </div>

      <MetricsGrid analytics={analytics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[250px]">
        <BudgetOverview 
          analytics={analytics}
          showBudgetEditor={showBudgetEditor}
          onToggleBudgetEditor={setShowBudgetEditor}
        />

        <CategoryAnalysis
          analytics={{
            categoryTotals: analytics.categoryTotals || {},
            budgetAnalysis: analytics.budgetAnalysis || []
          }}
          transactions={transactions}
          chartType={chartType}
          onChartTypeChange={setChartType}
        />

        <SpendingInsights analytics={analytics} />
      </div>

      <BudgetEditor
        isOpen={showBudgetEditor}
        onClose={() => setShowBudgetEditor(false)}
        analytics={analytics}
      />
    </div>
  );
}

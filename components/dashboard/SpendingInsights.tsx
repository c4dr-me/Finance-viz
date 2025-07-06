"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, CheckCircle, ArrowUpDown } from "lucide-react";

interface SpendingInsightsProps {
  analytics: {
    budgetAnalysis: Array<{
      category: string;
      status: string;
    }>;
    recentTransactions: Array<{
      _id: string;
      description: string;
      amount: number;
      type: 'income' | 'expense';
    }>;
  };
}

export function SpendingInsights({ analytics }: SpendingInsightsProps) {
  const budgetAnalysis = analytics?.budgetAnalysis || [];
  const recentTransactions = analytics?.recentTransactions || [];

  return (
    <Card className="bg-gradient-to-br from-violet-900 via-purple-800 to-gray-900 border-none shadow-lg min-h-[240px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm text-violet-200 flex items-center gap-2">
          <Activity className="h-2 w-2" />
          Spending Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 overflow-x-auto">
          {budgetAnalysis.filter(item => item.status === 'over').length > 0 && (
            <div className="flex items-center gap-2 p-2 bg-red-500/10 rounded border border-red-500/20">
              <AlertTriangle className="h-3 w-3 text-red-400 flex-shrink-0" />
              <span className="text-xs text-red-300">
                {budgetAnalysis.filter(item => item.status === 'over').length} budget(s) exceeded
              </span>
            </div>
          )}
          {budgetAnalysis.filter(item => item.status === 'warning').length > 0 && (
            <div className="flex items-center gap-2 p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
              <AlertTriangle className="h-3 w-3 text-yellow-400 flex-shrink-0" />
              <span className="text-xs text-yellow-300">
                {budgetAnalysis.filter(item => item.status === 'warning').length} budget(s) at 80%+
              </span>
            </div>
          )}
          {budgetAnalysis.filter(item => item.status === 'good').length === budgetAnalysis.length && budgetAnalysis.length > 0 && (
            <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded border border-green-500/20">
              <CheckCircle className="h-3 w-3 text-green-400 flex-shrink-0" />
              <span className="text-xs text-green-300">
                All budgets on track
              </span>
            </div>
          )}
          <div className="space-y-1 border-t border-violet-800">
            <span className="text-xs text-violet-200/70">Recent Activity</span>
            {recentTransactions.length === 0 ? (
              <div className="text-gray-400 text-xs text-center py-1">No transactions yet</div>
            ) : (
              <div className="flex flex-col gap-1 max-h-32 overflow-y-auto pr-1">
                {recentTransactions.map((tx) => (
                  <div key={tx._id} className="flex items-center justify-between group hover:bg-violet-500/5 rounded p-1 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <ArrowUpDown className={`h-3 w-3 ${
                        tx.type === 'income' ? 'text-green-400 rotate-180' : 'text-red-400'
                      }`} />
                      <span className="text-xs text-violet-200 truncate max-w-[60px] block">
                        {tx.description}
                      </span>
                    </div>
                    <span className={`text-xs font-semibold ${
                      tx.type === 'income' ? 'text-green-300' : 'text-red-300'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}${Math.abs(tx.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

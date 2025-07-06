"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target,
  Sparkles
} from "lucide-react";

interface MetricsGridProps {
  analytics: {
    netBalance: number;
    totalIncome: number;
    totalExpenses: number;
    savingsRate: number;
  };
}

export function MetricsGrid({ analytics }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 border-none shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm text-emerald-300 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Net Balance
          </CardTitle>
          <Sparkles className="h-4 w-4 text-emerald-400" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${(analytics.netBalance || 0) >= 0 ? 'text-emerald-200' : 'text-red-300'}`}>
            {(analytics.netBalance || 0) >= 0 ? '$' : '-$'}{Math.abs(analytics.netBalance || 0).toLocaleString()}
          </div>
          <CardDescription className="text-emerald-200/70 text-xs">
            Your balance
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 border-none shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm text-blue-300 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Total Income
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-200">
            ${(analytics.totalIncome || 0).toLocaleString()}
          </div>
          <CardDescription className="text-blue-200/70 text-xs">
            All time earnings
          </CardDescription>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-red-900 via-red-800 to-rose-900 border-none shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm text-red-300 flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Total Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-200">
            ${(analytics.totalExpenses || 0).toLocaleString()}
          </div>
          <CardDescription className="text-red-200/70 text-xs">
            All time spending
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-900 via-purple-800 to-violet-900 border-none shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm text-purple-300 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Savings Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-200">
            {(analytics.savingsRate || 0).toFixed(1)}%
          </div>
          <Progress 
            value={Math.max(0, Math.min(100, analytics.savingsRate || 0))} 
            className="h-2 mt-2"
          />
          <CardDescription className="text-purple-200/70 text-xs mt-1">
            {(analytics.savingsRate || 0) > 20 ? 'Excellent' : (analytics.savingsRate || 0) > 10 ? 'Good' : 'Needs improvement'}
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}

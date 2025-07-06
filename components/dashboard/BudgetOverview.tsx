"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Edit3 } from "lucide-react";
import { toast } from "sonner";

interface BudgetOverviewProps {
  analytics: {
    totalBudget: number;
    totalSpent: number;
    budgetUtilization: number;
  };
  showBudgetEditor: boolean;
  onToggleBudgetEditor: (show: boolean) => void;
}

export function BudgetOverview({ analytics, showBudgetEditor, onToggleBudgetEditor }: BudgetOverviewProps) {
  return (
    <Card className="bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900 border-none shadow-lg min-h-[240px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm text-amber-300 flex items-center gap-2">
          <Target className="h-4 w-4" />
          Budget Overview
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onToggleBudgetEditor(!showBudgetEditor);
            if (!showBudgetEditor) {
              toast.info("Set your monthly spending limits", {
                description: "Track your progress against your budget goals."
              });
            }
          }}
          className="text-amber-300 hover:text-amber-100 hover:bg-amber-800/30 flex items-center gap-1 px-2 py-1"
        >
          <Edit3 className="h-3 w-3" />
          <span className="text-xs">Edit</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-amber-200/70">Total Budget</span>
          <span className="text-sm font-semibold text-amber-200">
            ${(analytics.totalBudget || 0).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-amber-200/70">Total Spent</span>
          <span className="text-sm font-semibold text-amber-200">
            ${(analytics.totalSpent || 0).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-amber-200/70">Budget Utilization</span>
          <span className="text-sm font-semibold text-amber-200">
            {((analytics.budgetUtilization || 0).toFixed(1))}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-amber-200/70">Remaining</span>
          <span className="text-sm font-semibold text-amber-200">
            ${Math.abs((analytics.totalBudget || 0) - (analytics.totalSpent || 0)).toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

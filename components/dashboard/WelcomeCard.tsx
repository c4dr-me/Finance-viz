"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, TrendingUp, TrendingDown, Target } from "lucide-react";

export function WelcomeCard() {
  return (
    <Card className="bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 border-none shadow-lg">
      <CardContent className="text-center py-12">
        <Sparkles className="h-12 w-12 text-blue-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-blue-200 mb-2">Welcome to Your Finance Dashboard!</h3>
        <p className="text-blue-200/70 mb-4">
          Start by adding your first transaction to see your financial overview.
        </p>
        <div className="flex justify-center gap-4 text-sm text-blue-200/60">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Track Income
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Monitor Expenses
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Achieve Goals
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

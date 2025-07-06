"use client";

import { useMemo, useState } from 'react';
import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTransactionsContext } from "@/hooks/useTransactionContext";
import { getCategoryById } from "@/lib/categories";

const CATEGORY_COLORS = [
  "hsl(158 64% 52%)", 
  "hsl(239 84% 67%)", 
  "hsl(291 64% 42%)", 
  "hsl(48 96% 53%)",  
  "hsl(12 88% 59%)",  
];

export function TopCategoriesChart() {
  const { transactions } = useTransactionsContext();
  const [selectedType, setSelectedType] = useState<'expense' | 'income'>('expense');

  const handleTypeChange = (value: string) => {
    if (value === 'expense' || value === 'income') {
      setSelectedType(value);
    }
  };

  const { chartData, chartConfig, displayTitle, displayColor } = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    transactions
      .filter(tx => tx.type === selectedType)
      .forEach((tx) => {
        const categoryName = tx.category ? getCategoryById(tx.category)?.name || tx.category : 
          selectedType === 'expense' ? 'Uncategorized' : 'Salary';
        categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + Math.abs(tx.amount);
      });

    const topCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .filter(([, amount]) => amount > 0);


    const chartData = topCategories.map(([category, amount], index) => ({
      category,
      amount,
      fill: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    }));

    const chartConfig = topCategories.reduce(
      (acc, [category], idx) => ({
        ...acc,
        [category.replace(/\s+/g, '').toLowerCase()]: {
          label: category,
          color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
        },
      }),
      { amount: { label: "Amount" } } as ChartConfig
    );

    const displayTitle = selectedType === 'expense' ? 'Top Expense Categories' : 'Top Salary Categories';
    const displayColor = selectedType === 'expense' ? 'text-red-400' : 'text-green-400';

    return { chartData, chartConfig, displayTitle, displayColor };
  }, [transactions, selectedType]);

  if (chartData.length === 0) {
    return (
      <Card className="flex flex-col bg-gray-900/50 border-gray-700 h-full">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-violet-400">Top 5 Categories</CardTitle>
              <CardDescription className="text-gray-400">Select category type to view breakdown</CardDescription>
            </div>
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-40 bg-gray-800 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="expense">Expenses</SelectItem>
                <SelectItem value="income">Salary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-lg font-medium mb-2">No {selectedType === 'expense' ? 'expense' : 'salary'} data to display</div>
            <p className="text-sm">Add some {selectedType === 'expense' ? 'expense' : 'income'} transactions to see your top categories!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col bg-gray-900/50 border-gray-700 h-full">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-violet-400">Top 5 Categories</CardTitle>
            <CardDescription className="text-gray-400">
              {displayTitle}
            </CardDescription>
          </div>
          <Select value={selectedType} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-40 bg-gray-800 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="expense">Expenses</SelectItem>
              <SelectItem value="income">Salary</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0 flex flex-col items-center justify-center p-6">
        <h3 className={`text-sm font-medium mb-4 text-center ${displayColor}`}>{displayTitle}</h3>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px] min-h-[350px] min-w-[350px] max-w-[350px]"
        >
          <PieChart width={350} height={350}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="category"
              label={(entry) => `${entry.category}: $${(entry.amount || 0).toLocaleString()}`}
              labelLine={false}
              isAnimationActive={false}
              outerRadius={80}
              fill="#8884d8"
              fontSize={10}
              fontWeight={500}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

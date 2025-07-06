'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useTransactionsContext } from '@/hooks/useTransactionContext';

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(158 64% 52%)", 
  },
  expense: {
    label: "Expenses", 
    color: "hsl(239 84% 67%)", 
  },
} satisfies ChartConfig;

export function ExpenseChart() {
  const { transactions, loading } = useTransactionsContext();

  const chartData = useMemo(() => {
    const monthlyTotals: { [key: string]: { income: number; expense: number } } = {};
    
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthYear = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
      
      if (!monthlyTotals[monthYear]) {
        monthlyTotals[monthYear] = { income: 0, expense: 0 };
      }
      
      monthlyTotals[monthYear][transaction.type] += transaction.amount;
    });

    return Object.entries(monthlyTotals)
      .map(([month, totals]) => ({
        month,
        income: Number(totals.income.toFixed(2)),
        expense: Number(totals.expense.toFixed(2))
      }))
      .sort((a, b) => {
        const dateA = new Date(a.month + ' 1');
        const dateB = new Date(b.month + ' 1');
        return dateA.getTime() - dateB.getTime();
      })
      .slice(-6); 
  }, [transactions]);

  if (loading && transactions.length === 0) {
    return (
      <Card className="bg-gray-900/50 border-gray-700 h-full min-h-[400px] flex flex-col">
        <CardHeader>
          <CardTitle className="text-violet-400">Monthly Overview</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-gray-400">Loading chart data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700 h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-violet-400 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Overview
            </CardTitle>
            <CardDescription className="text-gray-400">
              Income vs Expenses over the last 6 months
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-6">
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No data available</h3>
              <p className="text-sm">Add some transactions to see your monthly overview!</p>
            </div>
          </div>
        ) : (
          <div className="h-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={chartData} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tick={{ fill: '#9CA3AF' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tick={{ fill: '#9CA3AF' }}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                    axisLine={false}
                    tickLine={false}
                    width={60}
                  />
                  <ChartTooltip 
                    content={
                      <ChartTooltipContent 
                        className="bg-gray-800 border-gray-600 text-gray-100"
                        formatter={(value, name) => [
                          `$${Number(value).toLocaleString()}`,
                          chartConfig[name as keyof typeof chartConfig]?.label || String(name)
                        ]}
                      />
                    } 
                  />
                  <Legend 
                    wrapperStyle={{ color: '#9CA3AF', paddingTop: '20px' }}
                    iconType="rect"
                  />
                  <Bar 
                    dataKey="income" 
                    fill={chartConfig.income.color}
                    radius={[2, 2, 0, 0]}
                    name="Income"
                  />
                  <Bar 
                    dataKey="expense" 
                    fill={chartConfig.expense.color}
                    radius={[2, 2, 0, 0]}
                    name="Expenses"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

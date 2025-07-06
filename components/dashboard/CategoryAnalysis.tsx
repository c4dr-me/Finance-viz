"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis, PieChart as RechartsPieChart, Cell, ResponsiveContainer, Pie } from "recharts";
import { PieChart, BarChart3 } from "lucide-react";

interface Transaction {
  _id: string;
  amount: number;
  type: 'income' | 'expense';
  category?: string;
  description: string;
  date: string;
}

interface CategoryAnalysisProps {
  analytics: {
    categoryTotals: Record<string, number>;
    budgetAnalysis: Array<{
      category: string;
      budget: number;
      spent: number;
    }>;
  };
  transactions: Transaction[];
  chartType: 'area' | 'pie';
  onChartTypeChange: (type: 'area' | 'pie') => void;
}

export function CategoryAnalysis({ 
  analytics, 
  transactions, 
  chartType, 
  onChartTypeChange 
}: CategoryAnalysisProps) {
  analytics = analytics || { categoryTotals: {}, budgetAnalysis: [] };

  return (
    <Card className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 border-none shadow-lg min-h-[250px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm text-indigo-300 flex items-center gap-2">
          <PieChart className="h-4 w-4" />
          Category Analysis
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChartTypeChange(chartType === 'area' ? 'pie' : 'area')}
            className="h-6 w-6 p-0 text-indigo-300 hover:text-indigo-100 hover:bg-indigo-800/30"
          >
            {chartType === 'area' ? <PieChart className="h-3 w-3" /> : <BarChart3 className="h-3 w-3" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!analytics.categoryTotals || Object.keys(analytics.categoryTotals).length === 0 ? (
          <div className="text-gray-400 text-xs text-center py-8">
            No transactions to display
          </div>
        ) : (
          <div className="h-[200px] w-[100%]">
            {chartType === 'area' ? (
              <ChartContainer
                key={`budget-chart-${transactions.length}-${(analytics.budgetAnalysis || []).reduce((sum, item) => sum + item.spent, 0)}`}
                config={{
                  budget: {
                    label: "Budget",
                    color: "#8b5cf6",
                  },
                  spent: {
                    label: "Spent",
                    color: "#f59e0b",
                  },
                }}
                className="h-full w-full"
              >
                <AreaChart
                  data={(analytics.budgetAnalysis || [])
                    .filter(item => item.budget > 0 || item.spent > 0)
                    .slice(0, 10)
                    .map((item) => ({
                      name: item.category.length > 6 ? 
                        item.category.substring(0, 6) + '..' : 
                        item.category,
                      budget: Number(item.budget) || 0,
                      spent: Number(item.spent) || 0,
                      fullName: item.category
                    }))}
                  margin={{ top: 10, right: 10, left: 0, bottom: 40 }}
                >
                  <defs>
                    <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="spentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name"
                    axisLine={true}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: "#a1a1aa" }}
                    interval={0}
                    angle={-35}
                    textAnchor="end"
                    height={70}
                    tickMargin={5}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: "#a1a1aa" }}
                    tickFormatter={(value) => `$${value}`}
                    width={35}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="bg-gray-800 border-gray-700"
                        formatter={(value, name) => [
                          `$${Number(value).toLocaleString()}`,
                          name === 'budget' ? 'Budget' : 'Spent'
                        ]}
                        labelFormatter={(label, payload) => {
                          const item = payload?.[0]?.payload;
                          return item?.fullName || label;
                        }}
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="budget"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="url(#budgetGradient)"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="spent"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fill="url(#spentGradient)"
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              // Pie chart showing category totals
              <ChartContainer
                key={`pie-chart-${transactions.length}`}
                config={Object.fromEntries(
                  Object.entries(analytics.categoryTotals || {}).slice(0, 15).map(([cat], index) => [
                    cat.toLowerCase().replace(/[^a-z0-9]/g, ''),
                    {
                      label: cat,
                      color: `hsl(${(index * 25) % 360}, 70%, 60%)`
                    }
                  ])
                )}
                className="h-full w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          className="bg-gray-800 border-gray-700"
                          formatter={(value, name) => [
                            `$${Number(value).toLocaleString()}`,
                            name
                          ]}
                        />
                      }
                    />
                    <Pie
                      data={Object.entries(analytics.categoryTotals || {})
                        .sort((a, b) => (b[1] as number) - (a[1] as number))
                        .slice(0, 15)
                        .map(([name, value], index) => ({
                          name: name.length > 12 ? name.substring(0, 12) + '...' : name,
                          value: Number(value),
                          fullName: name,
                          fill: `hsl(${(index * 25) % 360}, 70%, 60%)`
                        }))}
                      cx="50%"
                      cy="38%"
                      outerRadius={45}
                      dataKey="value"
                      label={({ name, percent }: { name?: string; percent?: number }) => 
                        (percent && percent > 0.05) ? `${name}: ${(percent * 100).toFixed(0)}%` : ''
                      }
                      labelLine={false}
                    >
                      {Object.entries(analytics.categoryTotals || {})
                        .sort((a, b) => (b[1] as number) - (a[1] as number))
                        .slice(0, 15)
                        .map((_, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${(index * 25) % 360}, 70%, 60%)`} />
                        ))
                      }
                    </Pie>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
            
            {/* Legend */}
            <div className="flex justify-center gap-4 text-xs">
              {chartType === 'area' ? (
                <>
                  <div className="flex items-center -mt-30 gap-1">
                    <div className="w-3 h-2 bg-violet-500/60 rounded-sm"></div>
                    <span className="text-indigo-200">Budget</span>
                  </div>
                  <div className="flex items-center -mt-30 gap-1">
                    <div className="w-3 h-2 bg-amber-500/80 rounded-sm"></div>
                    <span className="text-indigo-200">Spent</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center -mt-14">
                  <span className="text-indigo-200/60 text-[10px]">
                    Showing top {Math.min(15, Object.keys(analytics.categoryTotals || {}).length)} categories by amount
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

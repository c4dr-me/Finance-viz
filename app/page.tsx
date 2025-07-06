'use client';

import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { ExpenseChart } from '@/components/ExpenseChart';
import { TopCategoriesChart } from '@/components/TopCategoriesChart';
import { DashboardSummary } from '@/components/DashboardSummary';
import { TransactionProvider } from '@/hooks/useTransactionContext';
import { 
  DashboardSummarySkeleton, 
  TransactionFormSkeleton, 
  TransactionListSkeleton, 
  ChartSkeleton, 
  ExpenseChartSkeleton 
} from '@/components/ui/skeletons';
import { useTransactionsContext } from '@/hooks/useTransactionContext';
import { useBudgetContext } from '@/hooks/useBudgetContext';

export default function Home() {
  return (
    <TransactionProvider>
      <HomePage />
    </TransactionProvider>
  );
}

function HomePage() {
  const { loading: transactionsLoading } = useTransactionsContext();
  const { loading: budgetsLoading } = useBudgetContext();
  
  const isLoading = transactionsLoading || budgetsLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-violet-950">
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                  Personal Finance Visualizer
                </h1>
                <p className="text-gray-300 mt-2">
                  Track your income and expenses with beautiful real-time charts
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        <>
        {isLoading ? <DashboardSummarySkeleton /> : <DashboardSummary />}
        </>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4 md:space-y-12">
            <div className="h-auto md:h-[515px] mb-6 md:mb-8">
              {isLoading ? <TransactionFormSkeleton /> : <TransactionForm />}
            </div>
            <div className="h-auto md:h-[515px] mb-6 md:mb-0">
              {isLoading ? <TransactionListSkeleton /> : <TransactionList />}
            </div>
          </div>

          <div className="space-y-8">
            <div className="h-auto md:h-[515px] mb-6 md:mb-8">
              {isLoading ? <ExpenseChartSkeleton /> : <ExpenseChart />}
            </div>
            <div className="h-auto md:h-[515px] mb-6 md:mb-0">
              {isLoading ? <ChartSkeleton /> : <TopCategoriesChart />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

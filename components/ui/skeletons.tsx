import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSummarySkeleton() {
  return (
    <div className="w-full space-y-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 border-none text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-4 w-4 bg-emerald-400/50" />
                  <Skeleton className="h-4 w-20 bg-emerald-400/50" />
                </div>
                <Skeleton className="h-8 w-16 bg-emerald-300/60" />
                <Skeleton className="h-3 w-24 bg-emerald-400/40 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-none text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-4 w-4 bg-blue-400/50" />
                  <Skeleton className="h-4 w-24 bg-blue-400/50" />
                </div>
                <Skeleton className="h-8 w-16 bg-blue-300/60" />
                <Skeleton className="h-3 w-28 bg-blue-400/40 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-600 to-red-700 border-none text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-4 w-4 bg-red-400/50" />
                  <Skeleton className="h-4 w-28 bg-red-400/50" />
                </div>
                <Skeleton className="h-8 w-16 bg-red-300/60" />
                <Skeleton className="h-3 w-28 bg-red-400/40 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-none text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-4 w-4 bg-purple-400/50" />
                  <Skeleton className="h-4 w-24 bg-purple-400/50" />
                </div>
                <Skeleton className="h-8 w-20 bg-purple-300/60" />
                <Skeleton className="h-3 w-32 bg-purple-400/40 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 h-auto lg:h-[250px]">
        <Card className="bg-gradient-to-br from-orange-700 to-amber-800 border-none text-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 bg-orange-400/50" />
                <Skeleton className="h-5 w-28 bg-orange-400/50" />
              </div>
              <Skeleton className="h-6 w-12 bg-orange-400/50" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20 bg-orange-400/40" />
                <Skeleton className="h-4 w-16 bg-orange-300/60" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20 bg-orange-400/40" />
                <Skeleton className="h-4 w-16 bg-orange-300/60" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24 bg-orange-400/40" />
                <Skeleton className="h-4 w-12 bg-orange-300/60" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16 bg-orange-400/40" />
                <Skeleton className="h-4 w-16 bg-orange-300/60" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-indigo-800 to-indigo-900 border-none text-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 bg-indigo-400/50" />
                <Skeleton className="h-5 w-32 bg-indigo-400/50" />
              </div>
              <Skeleton className="h-6 w-6 bg-indigo-400/50" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-center justify-center h-[140px]">
              <Skeleton className="h-24 w-full bg-indigo-600/40" />
            </div>
            <div className="flex justify-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <Skeleton className="h-2 w-2 bg-indigo-400/60" />
                <Skeleton className="h-3 w-12 bg-indigo-400/40" />
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="h-2 w-2 bg-indigo-400/60" />
                <Skeleton className="h-3 w-12 bg-indigo-400/40" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spending Insights - Purple */}
        <Card className="bg-gradient-to-br from-violet-800 to-purple-900 border-none text-white">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 bg-violet-400/50" />
              <Skeleton className="h-5 w-32 bg-violet-400/50" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-2 bg-red-500/20 rounded border border-red-500/30">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-3 bg-red-400/60" />
                  <Skeleton className="h-3 w-32 bg-red-400/40" />
                </div>
              </div>
              <div className="border-t border-violet-700 pt-2">
                <Skeleton className="h-3 w-24 bg-violet-400/40 mb-2" />
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-3 bg-violet-400/60" />
                      <Skeleton className="h-3 w-12 bg-violet-400/40" />
                    </div>
                    <Skeleton className="h-3 w-12 bg-violet-400/40" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-3 bg-violet-400/60" />
                      <Skeleton className="h-3 w-8 bg-violet-400/40" />
                    </div>
                    <Skeleton className="h-3 w-12 bg-violet-400/40" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function TransactionFormSkeleton() {
  return (
    <Card className="bg-gray-800/50 border-gray-700 flex flex-col min-h-0 md:min-h-[515px]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 bg-gray-600" />
          <Skeleton className="h-6 w-40 bg-gray-600" />
        </div>
        <Skeleton className="h-4 w-64 bg-gray-700/50" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-8 bg-gray-600" />
          <Skeleton className="h-10 w-24 bg-gray-600" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16 bg-gray-600" />
          <Skeleton className="h-10 w-32 bg-gray-600" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 bg-gray-600" />
            <Skeleton className="h-10 w-full bg-gray-600" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-12 bg-gray-600" />
            <Skeleton className="h-10 w-full bg-gray-600" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 bg-gray-600" />
          <Skeleton className="h-20 w-full bg-gray-600" />
          <Skeleton className="h-3 w-32 bg-gray-700/50" />
        </div>
        <Skeleton className="h-10 w-full bg-blue-600/60" />
      </CardContent>
    </Card>
  );
}

export function TransactionListSkeleton() {
  return (
    <Card className="bg-gray-800/50 border-gray-700 flex flex-col min-h-0 md:min-h-[515px]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 bg-gray-600" />
          <Skeleton className="h-6 w-36 bg-gray-600" />
        </div>
        <Skeleton className="h-4 w-56 bg-gray-700/50" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full bg-gray-600" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-16 bg-gray-600" />
                  <Skeleton className="h-3 w-20 bg-gray-700/50" />
                </div>
              </div>
              <div className="text-right space-y-1">
                <Skeleton className="h-4 w-16 bg-gray-600" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ChartSkeleton() {
  return (
    <Card className="bg-gray-800/50 border-gray-700 min-h-[90%]">
      <CardHeader>
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 bg-gray-600" />
            <Skeleton className="h-6 w-22 bg-gray-600" />
          </div>
          <Skeleton className="h-5 w-5 bg-gray-600" />
        </div>
        <Skeleton className="h-4 w-48 bg-gray-700/50" />
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center justify-center h-[200px]">
          <Skeleton className="h-40 w-40 rounded-full bg-gray-600" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ExpenseChartSkeleton() {
  return (
    <Card className="bg-gray-800/50 border-gray-700 min-h-[104%]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 bg-gray-600" />
          <Skeleton className="h-6 w-32 bg-gray-600" />
        </div>
        <Skeleton className="h-4 w-56 bg-gray-700/50" />
      </CardHeader>
      <CardContent className="pt-4 pb-6">
        <div className="space-y-4">
          <div className="h-[200px] flex items-end justify-between gap-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const heights = [80, 120, 60, 100, 90, 140, 70];
              return (
                <Skeleton 
                  key={i} 
                  className="w-full bg-gray-600"
                  style={{ height: `${heights[i]}px` }}
                />
              );
            })}
          </div>
          <div className="flex justify-center gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 bg-blue-500" />
              <Skeleton className="h-3 w-16 bg-gray-600" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 bg-green-500" />
              <Skeleton className="h-3 w-12 bg-gray-600" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

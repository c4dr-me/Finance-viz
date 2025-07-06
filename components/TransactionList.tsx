'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, TrendingDown, Trash2, RefreshCw, Wallet, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { useTransactionsContext, Transaction } from '@/hooks/useTransactionContext';
import { getCategoryById } from '@/lib/categories';
import { TransactionEditDialog } from '@/components/TransactionEditDialog';

export function TransactionList({ onTransactionChange }: { onTransactionChange?: () => void }) {
  const { transactions, loading, error, deleteTransaction } = useTransactionsContext();
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async (transaction: Transaction) => {
    setDeletingTransaction(transaction);
  };

  const confirmDelete = async () => {
    if (!deletingTransaction) return;

    setDeleteLoading(true);

    try {
      const result = await deleteTransaction(deletingTransaction._id);
      
      if (result.success) {
        toast.success('Transaction deleted successfully');
        onTransactionChange?.();
      } else {
        toast.error(result.error || 'Failed to delete transaction');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setDeleteLoading(false);
      setDeletingTransaction(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return 'Other';
    const category = getCategoryById(categoryId);
    return category?.name || categoryId;
  };

  const getCategoryIcon = (categoryId?: string) => {
    if (!categoryId) return Wallet;
    const category = getCategoryById(categoryId);
    return category?.icon || Wallet;
  };

  const getCategoryColor = (categoryId?: string) => {
    if (!categoryId) return '#6b7280';
    const category = getCategoryById(categoryId);
    return category?.color || '#6b7280';
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (error) {
    return (
      <Card className="bg-gray-900/50 border-gray-700 h-full min-h-[500px] flex flex-col">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Transaction History
          </CardTitle>
          <CardDescription className="text-gray-400">
            Error loading transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-red-400">
            <p>{error}</p>
            <Button 
              variant="outline" 
              className="mt-4 border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-gray-900/50 border-gray-700 h-[515px] flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-emerald-400 flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Transaction History
              </CardTitle>
              <CardDescription className="text-gray-400">
                Recent income and expense transactions
              </CardDescription>
            </div>
            {loading && (
              <RefreshCw className="h-4 w-4 animate-spin text-gray-400" />
            )}
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden">
          {loading && transactions.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-400">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p>Loading transactions...</p>
              </div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-400">
                <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
                <p className="text-sm">Start by adding your first transaction above!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 max-h-full overflow-y-auto pr-2">
              {sortedTransactions.map((transaction) => {
                const CategoryIcon = getCategoryIcon(transaction.category);
                const categoryColor = getCategoryColor(transaction.category);
                
                return (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${categoryColor}20` }}
                      >
                        <CategoryIcon 
                          className="h-4 w-4" 
                          style={{ color: categoryColor }}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-gray-200 font-medium truncate">
                            {transaction.description}
                          </p>
                          <Badge 
                            variant={transaction.type === 'income' ? 'default' : 'secondary'}
                            className={`text-xs ${
                              transaction.type === 'income' 
                                ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30' 
                                : 'bg-red-600/20 text-red-400 border-red-500/30'
                            }`}
                          >
                            <span className="flex items-center gap-1">
                              {transaction.type === 'income' ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              {transaction.type}
                            </span>
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span>{getCategoryName(transaction.category)}</span>
                          <Separator orientation="vertical" className="h-3" />
                          <span>{formatDate(transaction.date)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className={`font-semibold text-lg ${
                          transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingTransaction(transaction)}
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(transaction)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog 
        open={!!deletingTransaction} 
        onOpenChange={(open) => !open && setDeletingTransaction(null)}
      >
        <AlertDialogContent className="bg-gray-900 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-100">
              Delete Transaction
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this transaction? This action cannot be undone.
              <div className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <span className="text-gray-200 font-medium block">
                  {deletingTransaction?.description}
                </span>
                <span className={`text-sm block ${
                  deletingTransaction?.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {deletingTransaction?.type === 'income' ? '+' : '-'}
                  {deletingTransaction && formatCurrency(Math.abs(deletingTransaction.amount))}
                </span>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-gray-100"
              disabled={deleteLoading}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <TransactionEditDialog
        transaction={editingTransaction}
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
      />
    </>
  );
}

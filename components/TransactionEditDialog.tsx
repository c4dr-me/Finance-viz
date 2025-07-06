'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { getCategoriesByType, getDefaultCategory } from '@/lib/categories';
import { useTransactionsContext, Transaction } from '@/hooks/useTransactionContext';

interface TransactionEditDialogProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionEditDialog({ transaction, isOpen, onClose }: TransactionEditDialogProps) {
  const { updateTransaction } = useTransactionsContext();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});


  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount.toString());
      setDescription(transaction.description);
      setDate(transaction.date.split('T')[0]); 
      setType(transaction.type);
      setCategory(transaction.category || getDefaultCategory(transaction.type).id);
    }
  }, [transaction]);

  useEffect(() => {
    if (!transaction && category) {
      setCategory(getDefaultCategory(type).id);
    }
  }, [type, transaction, category]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!date) {
      newErrors.date = 'Date is required';
    }
    
    if (!category) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !transaction) {
      return;
    }

    setLoading(true);

    try {
      const result = await updateTransaction(transaction._id, {
        amount: parseFloat(amount),
        description: description.trim(),
        date,
        type,
        category,
      });

      if (result.success) {
        toast.success('Transaction updated successfully');
        onClose();
      } else {
        toast.error(result.error || 'Failed to update transaction');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setDate('');
    setType('expense');
    setCategory('');
    setErrors({});
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  if (!transaction) return null;

  const categories = getCategoriesByType(type);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-gray-100 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-gray-100 flex items-center gap-2">
            {type === 'income' ? (
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-400" />
            )}
            Edit Transaction
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Update the transaction details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Transaction Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-gray-200">Type</Label>
            <Select value={type} onValueChange={(value: 'income' | 'expense') => setType(value)}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="expense" className="text-gray-100 focus:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-400" />
                    Expense
                  </div>
                </SelectItem>
                <SelectItem value="income" className="text-gray-100 focus:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    Income
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-gray-200">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
                  setAmount(value);
                }
              }}
              onKeyPress={(e) => {
                if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                  e.preventDefault();
                }
              }}
              className="bg-gray-800 border-gray-600 text-gray-100 placeholder:text-gray-400"
              disabled={loading}
            />
            {errors.amount && <p className="text-red-400 text-sm">{errors.amount}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-200">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter transaction description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-800 border-gray-600 text-gray-100 placeholder:text-gray-400 resize-none"
              rows={2}
              disabled={loading}
            />
            {errors.description && <p className="text-red-400 text-sm">{errors.description}</p>}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-gray-200">Category</Label>
            <Select value={category} onValueChange={setCategory} disabled={loading}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-gray-100">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {categories.map((cat) => {
                  const IconComponent = cat.icon;
                  return (
                    <SelectItem 
                      key={cat.id} 
                      value={cat.id}
                      className="text-gray-100 focus:bg-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" style={{ color: cat.color }} />
                        {cat.name}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-red-400 text-sm">{errors.category}</p>}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-gray-200">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-gray-800 border-gray-600 text-gray-100"
              disabled={loading}
            />
            {errors.date && <p className="text-red-400 text-sm">{errors.date}</p>}
          </div>
        </form>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className={`${
              type === 'income' 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : 'bg-red-600 hover:bg-red-700'
            } text-white`}
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Transaction'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

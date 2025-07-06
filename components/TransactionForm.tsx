'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getCategoriesByType, getDefaultCategory } from '@/lib/categories';
import { useTransactionsContext } from '@/hooks/useTransactionContext';

export function TransactionForm({ onTransactionAdded }: { onTransactionAdded?: () => void }) {
  const { addTransaction } = useTransactionsContext();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState(() => getDefaultCategory('expense').id); // Use default category safely
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setDate(new Date().toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (isClient) {
      setCategory(getDefaultCategory(type).id);
    }
  }, [type, isClient]);

  const handleTypeChange = (newType: 'income' | 'expense') => {
    setType(newType);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    // Ensure amount is not negative
    if (parseFloat(amount) < 0) {
      newErrors.amount = 'Amount cannot be negative';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
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
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setLoading(true);

    try {
      const result = await addTransaction({
        amount: parseFloat(amount),
        description: description.trim(),
        date: new Date(date).toISOString(),
        type,
        category
      });
      
      if (result.success) {
        setAmount('');
        setDescription('');
        setDate(new Date().toISOString().split('T')[0]);
        setType('expense');
        setCategory(getDefaultCategory('expense').id);
        setErrors({});
        toast.success(`${type === 'income' ? 'Income' : 'Expense'} added successfully!`);
        onTransactionAdded?.();
      } else {
        toast.error(result.error || 'Failed to add transaction');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gray-900/50 border-gray-700 h-full min-h-[515px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-violet-400">Add New Transaction</CardTitle>
        <CardDescription className="text-gray-400">
          Track your income and expenses in real-time
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Type</Label>
            <Select value={type} onValueChange={(value: 'income' | 'expense') => handleTypeChange(value)}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-violet-500 focus:ring-violet-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="expense" className="text-white focus:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-400" />
                    <span>Expense</span>
                  </div>
                </SelectItem>
                <SelectItem value="income" className="text-white focus:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span>Income</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Category</Label>
            {isClient ? (
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-violet-500 focus:ring-violet-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {getCategoriesByType(type).map((cat) => {
                    const IconComponent = cat.icon;
                    return (
                      <SelectItem key={cat.id} value={cat.id} className="text-white focus:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" style={{ color: cat.color }} />
                          <span>{cat.name}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            ) : (
              <div className="bg-gray-800 border border-gray-600 rounded-md h-10 flex items-center px-3 text-gray-400">
                Loading categories...
              </div>
            )}
            {errors.category && (
              <p className="text-red-400 text-sm">{errors.category}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-gray-300">
                Amount ($)
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
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
                placeholder="0.00"
                className={`bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-violet-500 focus:ring-violet-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0 ${
                  errors.amount ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                style={{
                  MozAppearance: 'textfield'
                }}
                required
              />
              {errors.amount && (
                <p className="text-red-400 text-sm">{errors.amount}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date" className="text-gray-300">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-violet-500 focus:ring-violet-500 ${
                  errors.date ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                disabled={!isClient}
                required
              />
              {errors.date && (
                <p className="text-red-400 text-sm">{errors.date}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What was this for?"
              className={`bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-violet-500 focus:ring-violet-500 min-h-[80px] resize-none ${
                errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              maxLength={200}
              required
            />
            {errors.description && (
              <p className="text-red-400 text-sm">{errors.description}</p>
            )}
            <p className="text-gray-500 text-xs">{description.length}/200 characters</p>
          </div>

          
          <Button
            type="submit"
            disabled={loading}
            className={`w-full font-medium transition-colors disabled:cursor-not-allowed ${
              type === 'income' 
                ? 'bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600' 
                : 'bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600'
            } text-white`}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              `Add ${type === 'income' ? 'Income' : 'Expense'}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

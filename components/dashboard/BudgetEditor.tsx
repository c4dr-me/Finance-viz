"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Trash2, Loader2 } from "lucide-react";
import { getCategoriesByType } from "@/lib/categories";
import { toast } from "sonner";
import { useBudgetContext } from "@/hooks/useBudgetContext";

interface BudgetEditorProps {
  isOpen: boolean;
  onClose: () => void;
  analytics: {
    monthlySpending: Record<string, number>;
  };
}

export function BudgetEditor({ isOpen, onClose, analytics }: BudgetEditorProps) {
  const [saving, setSaving] = useState(false);
  const { budgets, setBudgets } = useBudgetContext();

  const safeAnalytics = {
    ...analytics,
    monthlySpending: analytics?.monthlySpending || {},
  };

  const handleDeleteBudget = async (categoryName: string) => {
    setBudgets(prev => ({
      ...prev,
      [categoryName]: 0
    }));
    
    toast.success(`Removed budget for ${categoryName}`);
  };

  const handleClearAll = () => {
    const clearedBudgets: Record<string, number> = {};
    getCategoriesByType('expense').forEach(category => {
      clearedBudgets[category.name] = 0;
    });
    setBudgets(clearedBudgets);
    toast.success("Cleared all budgets");
  };

  const handleSave = async () => {
    if (saving) return;
    
    setSaving(true);
    
    try {
      const response = await fetch('/api/budgets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budgets }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        onClose();
        toast.success("Budget settings saved successfully!", {
          description: data.message
        });
      } else {
        throw new Error(data.error || 'Failed to save budgets');
      }
    } catch {
      toast.error("Failed to save budget settings", {
        description: "Please try again or check your connection."
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-gray-100 max-w-full w-[90vw] sm:max-w-lg md:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-gray-100 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Set Monthly Budgets
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Set spending limits for each category to track your budget performance
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-6">
            {getCategoriesByType('expense').map((category) => (
              <div key={category.id} className="space-y-2">
                <label className="text-sm text-gray-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <category.icon className="h-4 w-4" style={{ color: category.color }} />
                    {category.name}
                  </div>
                  {budgets[category.name] > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteBudget(category.name)}
                      className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      title={`Remove budget for ${category.name}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    value={budgets[category.name] || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
                        setBudgets(prev => ({
                          ...prev,
                          [category.name]: value === '' ? 0 : parseFloat(value) || 0
                        }));
                      }
                    }}
                    onKeyPress={(e) => {
                      if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                        e.preventDefault();
                      }
                    }}
                    className="bg-gray-800 border-gray-700 text-gray-100 flex-1"
                  />
                </div>
                <div className="text-xs text-gray-500">
                  Spent: ${safeAnalytics.monthlySpending[category.name] || 0}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mt-6 gap-2 sm:gap-0 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={handleClearAll}
              className="bg-gray-800 border-gray-700 text-red-400 hover:bg-red-900/20 hover:text-red-300 w-full sm:w-auto mb-2 sm:mb-0"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={onClose}
                className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 w-full sm:w-auto"
              >
                Close
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Budgets'
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

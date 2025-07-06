import { TrendingUp, Home, Car, Utensils, ShoppingBag, Gamepad2, Heart, GraduationCap, Plane, Gift, Wrench, CreditCard, DollarSign, Briefcase, Award, LucideIcon } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: LucideIcon;
  description: string;
}

export const PREDEFINED_CATEGORIES: Category[] = [
  {
    id: 'salary',
    name: 'Salary',
    type: 'income',
    color: '#10b981',
    icon: Briefcase,
    description: 'Monthly salary and wages'
  },
  {
    id: 'freelance',
    name: 'Freelance',
    type: 'income',
    color: '#059669',
    icon: DollarSign,
    description: 'Freelance and contract work'
  },
  {
    id: 'investment',
    name: 'Investment',
    type: 'income',
    color: '#047857', 
    icon: TrendingUp,
    description: 'Dividends, interest, and investment returns'
  },
  {
    id: 'bonus',
    name: 'Bonus',
    type: 'income',
    color: '#064e3b', 
    icon: Award,
    description: 'Bonuses and incentives'
  },


  {
    id: 'housing',
    name: 'Housing',
    type: 'expense',
    color: '#6366f1', 
    icon: Home,
    description: 'Rent, mortgage, utilities'
  },
  {
    id: 'transportation',
    name: 'Transportation',
    type: 'expense',
    color: '#4f46e5', 
    icon: Car,
    description: 'Gas, public transport, car maintenance'
  },
  {
    id: 'food',
    name: 'Food & Dining',
    type: 'expense',
    color: '#4338ca', 
    icon: Utensils,
    description: 'Groceries, restaurants, food delivery'
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    type: 'expense',
    color: '#3730a3', 
    icon: Gamepad2,
    description: 'Movies, games, streaming services'
  },
  {
    id: 'shopping',
    name: 'Shopping',
    type: 'expense',
    color: '#312e81', 
    icon: ShoppingBag,
    description: 'Clothing, electronics, general shopping'
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    type: 'expense',
    color: '#ef4444', 
    icon: Heart,
    description: 'Medical expenses, insurance, pharmacy'
  },
  {
    id: 'education',
    name: 'Education',
    type: 'expense',
    color: '#dc2626', 
    icon: GraduationCap,
    description: 'Courses, books, training'
  },
  {
    id: 'travel',
    name: 'Travel',
    type: 'expense',
    color: '#b91c1c', 
    icon: Plane,
    description: 'Vacation, business travel, accommodation'
  },
  {
    id: 'gifts',
    name: 'Gifts & Donations',
    type: 'expense',
    color: '#991b1b', 
    icon: Gift,
    description: 'Gifts, charity, donations'
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    type: 'expense',
    color: '#7f1d1d', 
    icon: Wrench,
    description: 'Home repairs, car service, maintenance'
  },
  {
    id: 'bills',
    name: 'Bills & Services',
    type: 'expense',
    color: '#f59e0b', 
    icon: CreditCard,
    description: 'Phone, internet, subscriptions'
  },
];

export const getCategoryById = (id: string): Category | undefined => {
  return PREDEFINED_CATEGORIES.find(cat => cat.id === id);
};

export const getCategoriesByType = (type: 'income' | 'expense'): Category[] => {
  return PREDEFINED_CATEGORIES.filter(cat => cat.type === type);
};

export const getDefaultCategory = (type: 'income' | 'expense'): Category => {
  const categories = getCategoriesByType(type);
  return categories[0] || PREDEFINED_CATEGORIES[0];
};

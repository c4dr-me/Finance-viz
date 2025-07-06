import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Transaction } from '@/models/Transaction';
import { Budget } from '@/models/Budget';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

    const monthlyExpenses = await Transaction.aggregate([
      {
        $match: {
          type: 'expense',
          date: {
            $gte: new Date(year, 0, 1),
            $lt: new Date(year + 1, 0, 1)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$date' },
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const monthData = monthlyExpenses.find(item => item._id === i + 1);
      return {
        month: new Date(0, i).toLocaleString('default', { month: 'short' }),
        amount: monthData ? monthData.total : 0
      };
    });

    const currentDate = new Date();
    const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    const [totalIncome, totalExpenses, currentMonthExpenses] = await Promise.all([
      Transaction.aggregate([
        { $match: { type: 'income' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { type: 'expense' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { 
          $match: { 
            type: 'expense',
            date: { $gte: currentMonthStart }
          } 
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    // Get category totals
    const categoryTotals = await Transaction.aggregate([
      { $match: { type: 'expense' } },
      { 
        $group: { 
          _id: '$category', 
          total: { $sum: '$amount' } 
        } 
      }
    ]);

    // Convert to object with safe fallbacks
    const categoryTotalsObj = categoryTotals.reduce((acc: Record<string, number>, item: { _id: string; total: number }) => {
      if (item._id) {
        acc[item._id] = item.total || 0;
      }
      return acc;
    }, {});

    // Get current month's budgets from database
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    const budgetData = await Budget.find({
      month: currentMonth,
      year: currentYear
    }).lean();

    // Create budget analysis with real budget data
    const budgetAnalysis = budgetData.map(budget => {
      const spent = categoryTotalsObj[budget.categoryName] || 0;
      const budgetAmount = budget.amount || 0;
      const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;
      
      return {
        category: budget.categoryName,
        budget: budgetAmount,
        spent,
        status: percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good'
      };
    });

    // Calculate total budget and spent for summary
    const totalBudget = budgetData.reduce((sum, budget) => sum + (budget.amount || 0), 0);
    const budgetUtilization = totalBudget > 0 ? ((totalExpenses[0]?.total || 0) / totalBudget) * 100 : 0;

    const recentTransactions = await Transaction
      .find()
      .sort({ date: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      monthlyExpenses: monthlyData,
      summary: {
        totalIncome: totalIncome[0]?.total || 0,
        totalExpenses: totalExpenses[0]?.total || 0,
        currentMonthExpenses: currentMonthExpenses[0]?.total || 0,
        balance: (totalIncome[0]?.total || 0) - (totalExpenses[0]?.total || 0),
        totalBudget,
        budgetUtilization
      },
      recentTransactions,
      categoryTotals: categoryTotalsObj,
      budgetAnalysis
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

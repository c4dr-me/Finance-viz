import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Budget } from '@/models/Budget';
import { Transaction } from '@/models/Transaction';


export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString());
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    
    const budgets = await Budget.find({ month, year }).sort({ categoryName: 1 });
    
    const budgetsWithSpending = await Promise.all(
      budgets.map(async (budget) => {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);
        
        const spending = await Transaction.aggregate([
          {
            $match: {
              category: budget.categoryName,
              type: 'expense',
              date: { $gte: startDate, $lte: endDate }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' }
            }
          }
        ]);
        
        const spentAmount = spending[0]?.total || 0;
        const remaining = Math.max(0, budget.amount - spentAmount);
        const percentageUsed = budget.amount > 0 ? Math.round((spentAmount / budget.amount) * 100) : 0;
        const isOverBudget = spentAmount > budget.amount;
        
        return {
          ...budget.toObject(),
          spent: spentAmount,
          remaining,
          percentageUsed,
          isOverBudget
        };
      })
    );
    
    return NextResponse.json({ 
      success: true, 
      budgets: budgetsWithSpending,
      month,
      year
    });
  } catch (error) {
    console.error('Error getting budgets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get budgets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { categoryName, amount, month, year } = body;
    
    // Validation
    if (!categoryName || !amount || !month || !year) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: categoryName, amount, month, year' },
        { status: 400 }
      );
    }
    
    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }
    
    if (month < 1 || month > 12) {
      return NextResponse.json(
        { success: false, error: 'Month must be between 1 and 12' },
        { status: 400 }
      );
    }
    
    const existingBudget = await Budget.findOne({ categoryName, month, year });
    
    let budget;
    let action;
    
    if (existingBudget) {
      existingBudget.amount = amount;
      await existingBudget.save();
      budget = existingBudget;
      action = 'updated';
    } else {
      budget = new Budget({
        categoryName,
        amount,
        month,
        year
      });
      
      await budget.save();
      action = 'created';
    }
    
    return NextResponse.json({ 
      success: true, 
      budget,
      message: `Budget ${action} successfully`
    });
    
  } catch (error: unknown) {
    console.error('Error creating/updating budget:', error);
    if (error && typeof error === 'object' && 'code' in error && (error as { code: number }).code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Budget already exists for this category and month' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create/update budget' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const budgetId = searchParams.get('id');
    
    if (!budgetId) {
      return NextResponse.json(
        { success: false, error: 'Budget ID is required' },
        { status: 400 }
      );
    }
    
    const deletedBudget = await Budget.findByIdAndDelete(budgetId);
    
    if (!deletedBudget) {
      return NextResponse.json(
        { success: false, error: 'Budget not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Budget deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting budget:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete budget' },
      { status: 500 }
    );
  }
}

// PUT bulk update budgets
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { budgets } = body;
    
    // Validation
    if (!budgets || typeof budgets !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Budgets object is required' },
        { status: 400 }
      );
    }
    
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    
    // Separate budgets to update vs delete
    const budgetsToUpdate = Object.entries(budgets)
      .filter(([, amount]) => (amount as number) > 0)
      .map(([categoryName, amount]) => ({
        categoryName,
        amount: amount as number,
        month,
        year
      }));
    
    const budgetsToDelete = Object.entries(budgets)
      .filter(([, amount]) => (amount as number) === 0)
      .map(([categoryName]) => categoryName);
    
    const operations = [];
    
    // Add update/upsert operations
    if (budgetsToUpdate.length > 0) {
      const updateOps = budgetsToUpdate.map(({ categoryName, amount, month, year }) => ({
        updateOne: {
          filter: { categoryName, month, year },
          update: { categoryName, amount, month, year },
          upsert: true
        }
      }));
      operations.push(...updateOps);
    }
    
    // Add delete operations
    if (budgetsToDelete.length > 0) {
      const deleteOps = budgetsToDelete.map((categoryName) => ({
        deleteMany: {
          filter: { categoryName, month, year }
        }
      }));
      operations.push(...deleteOps);
    }
    
    let result = { modifiedCount: 0, upsertedCount: 0, deletedCount: 0 };
    
    if (operations.length > 0) {
      const bulkResult = await Budget.bulkWrite(operations);
      result = {
        modifiedCount: bulkResult.modifiedCount || 0,
        upsertedCount: bulkResult.upsertedCount || 0,
        deletedCount: bulkResult.deletedCount || 0
      };
    }
    
    return NextResponse.json({ 
      success: true,
      message: `Successfully processed budgets: ${budgetsToUpdate.length} updated, ${budgetsToDelete.length} deleted`,
      result: {
        ...result,
        totalUpdated: budgetsToUpdate.length,
        totalDeleted: budgetsToDelete.length
      }
    });
    
  } catch (error: unknown) {
    console.error('Error bulk updating budgets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update budgets' },
      { status: 500 }
    );
  }
}

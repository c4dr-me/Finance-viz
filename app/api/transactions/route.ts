import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Transaction } from '@/models/Transaction';

function getBaseUrl(): string {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  return 'http://localhost:3000';
}

export async function GET() {
  try {
    await connectDB();
    
    const transactions = await Transaction.find({})
      .sort({ createdAt: -1, date: -1 })
      .limit(100); 
    
    return NextResponse.json({ 
      success: true, 
      transactions 
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to get transactions' },
      { status: 500 }
    );
  }
}
 
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { amount, description, date, type, category } = body;
    
    if (!amount || !description || !date || !type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['income', 'expense'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Type must be income or expense' },
        { status: 400 }
      );
    }
    
    const transaction = new Transaction({
      amount: parseFloat(amount),
      description,
      date: new Date(date),
      type,
      category
    });
    
    await transaction.save();
    

    try {
      const baseUrl = getBaseUrl();
      await fetch(`${baseUrl}/api/socketio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'created',
          transaction: {
            _id: transaction._id.toString(),
            amount: transaction.amount,
            description: transaction.description,
            date: transaction.date.toISOString(),
            type: transaction.type,
            category: transaction.category,
            createdAt: transaction.createdAt?.toISOString(),
            updatedAt: transaction.updatedAt?.toISOString()
          }
        })
      });
      
    } catch {
    }
    
    return NextResponse.json({ 
      success: true, 
      transaction 
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

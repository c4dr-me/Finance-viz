import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Transaction } from '@/models/Transaction';
import { TransactionSchema } from '@/lib/validations';
import mongoose from 'mongoose';

interface RouteParams {
  params: Promise<{ id: string }>;
}

function getBaseUrl(): string {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  return 'http://localhost:3000';
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid transaction ID' },
        { status: 400 }
      );
    }

    const transaction = await Transaction.findById(id);
    
    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid transaction ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    const validatedData = TransactionSchema.parse({
      ...body,
      date: new Date(body.date)
    });

    const transaction = await Transaction.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    try {
      const socketResponse = await fetch(`${getBaseUrl()}/api/socketio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updated',
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
      
      if (!socketResponse.ok) {
        console.warn('⚠️ Socket broadcast failed for update:', socketResponse.status);
      }
    } catch {
      // Socket.IO not available, continue without broadcasting
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid transaction data', details: error },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

// DELETE - Delete transaction
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid transaction ID' },
        { status: 400 }
      );
    }

    const transaction = await Transaction.findByIdAndDelete(id);

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Broadcast real-time update via Socket.IO
    try {
      const socketResponse = await fetch(`${getBaseUrl()}/api/socketio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deleted',
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
      
      if (!socketResponse.ok) {
        console.warn('⚠️ Socket broadcast failed for delete:', socketResponse.status);
      }
    } catch {
      // Socket.IO not available, continue without broadcasting
    }

    // Return success: true for client compatibility
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
}

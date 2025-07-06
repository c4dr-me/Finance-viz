import { Server as ServerIO } from 'socket.io';

export interface TransactionData {
  _id?: string;
  amount?: number;
  description?: string;
  date?: string;
  type?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

let io: ServerIO | null = null;

export function getIO(): ServerIO | null {
  return io;
}

export function setIO(ioInstance: ServerIO): void {
  io = ioInstance;
}

export function broadcastUpdate(action: string, transaction: TransactionData): boolean {
  if (io) {
    io.to('finance-updates').emit('transaction-update', {
      action,
      transaction,
      timestamp: new Date()
    });
    return true;
  } else {
    return false;
  }
}

'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface TransactionUpdate {
  action: string;
  transaction: {
    _id: string;
    amount: number;
    description: string;
    date: string;
    category?: string;
    type: 'income' | 'expense';
    createdAt: string;
    updatedAt: string;
  };
  timestamp: Date;
}

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let socketInstance: Socket;

    const initSocket = async () => {
      try {
        await fetch('/api/socketio');
        
        socketInstance = io({
          path: '/api/socketio',
          transports: ['polling', 'websocket'], 
          forceNew: true,
          reconnectionAttempts: 5,
          timeout: 10000
        });

        socketInstance.on('connect', () => {
          setIsConnected(true);
          
          socketInstance.emit('join-room', 'finance-updates');
        });

        socketInstance.on('disconnect', () => {
          setIsConnected(false);
        });

        setSocket(socketInstance);
      } catch {
        
      }
    };

    initSocket();

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  return { socket, isConnected };
};

// Hook for listening to transaction updates
export const useTransactionUpdates = (onUpdate: (data: TransactionUpdate) => void) => {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    console.log('🔊 Setting up transaction-update listener');

    // Listen for real-time transaction updates
    const handler = (data: TransactionUpdate) => {
      console.log('📨 Received transaction update:', data);
      onUpdate(data);
    };

    socket.on('transaction-update', handler);

    return () => {
      socket.off('transaction-update', handler);
    };
  }, [socket, onUpdate, isConnected]);
};

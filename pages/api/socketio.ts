import { NextApiRequest, NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';
import { Server as NetServer } from 'http';

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: ServerIO;
    };
  };
};

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket.server.io) {
    
    const httpServer = res.socket.server;
    const io = new ServerIO(httpServer, {
      path: '/api/socketio',
      transports: ['polling', 'websocket'],
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      },
      allowEIO3: true,
      pingTimeout: 60000,
      pingInterval: 25000
    });

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);
      
      socket.join('finance-updates');
      console.log('User joined finance-updates room:', socket.id);
      
      socket.on('join-room', (room) => {
        socket.join(room);
      });
      
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
      
      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    });

    res.socket.server.io = io;
    console.log('Socket.IO server ready');
  }
  
  if (req.method === 'POST') {
    try {
      /*console.log('Received POST request body:', JSON.stringify(req.body, null, 2));*/
      
      const { action, transaction } = req.body;
      
      if (transaction && action) {
        console.log('Broadcasting transaction update:', { action, transactionId: transaction?._id });
        
        const io = res.socket.server.io;
        if (io) {
          try {
            io.to('finance-updates').emit('transaction-update', {
              action,
              transaction,
              timestamp: new Date()
            });
            console.log('Transaction update broadcast complete');
            res.status(200).json({ success: true });
          } catch (broadcastError) {
            console.error('Error during transaction broadcast:', broadcastError);
            res.status(500).json({ error: 'Transaction broadcast failed', details: broadcastError instanceof Error ? broadcastError.message : 'Unknown error' });
          }
        } else {
          console.warn('Socket.IO server not available for broadcasting');
          res.status(503).json({ error: 'Socket.IO server not available' });
        }
      }
      else {
        console.error('Missing action and transaction data in body:', { action, hasTransaction: !!transaction });
        return res.status(400).json({ error: 'Missing action and transaction data' });
      }
    } catch (error) {
      console.error('Error broadcasting update:', error);
      res.status(400).json({ error: 'Invalid request body', details: error instanceof Error ? error.message : 'Unknown error' });
    }
  } else if (req.method === 'GET') {
    res.status(200).json({ 
      status: 'ok', 
      message: 'Socket.IO server is running',
      hasServer: !!res.socket.server.io 
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

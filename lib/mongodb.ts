import mongoose from 'mongoose';


const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/finance-visualizer';

export async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    await mongoose.connect(MONGODB_URI);
    return mongoose.connection;
  } catch (error) {
    throw error;
  }
}

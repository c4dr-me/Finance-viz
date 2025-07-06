import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
    default: 'expense'
  },
  category: {
    type: String,
    required: true,
    default: function() {
      return this.type === 'income' ? 'salary' : 'housing';
    }
  }
}, {
  timestamps: true 
});

export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);

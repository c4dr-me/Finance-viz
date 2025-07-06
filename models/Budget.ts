import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBudget extends Document {
  categoryName: string; 
  amount: number; 
  month: number; 
  year: number; 
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema = new Schema<IBudget>({
  categoryName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true,
    min: 2020
  }
}, {
  timestamps: true
});

BudgetSchema.index({ categoryName: 1, month: 1, year: 1 }, { unique: true });

export const Budget: Model<IBudget> = 
  mongoose.models.Budget || mongoose.model<IBudget>('Budget', BudgetSchema);

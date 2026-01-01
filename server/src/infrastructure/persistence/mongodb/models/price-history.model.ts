import { Schema, model, Document, Types } from 'mongoose';
import { PriceType } from 'src/domain/entities/price-history.entity';

export interface PriceHistoryDocument extends Document {
  planId: Types.ObjectId;
  stripePriceId: string;
  type: PriceType;
  amount: number;
  isActive: boolean;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const PriceHistorySchema = new Schema<PriceHistoryDocument>(
  {
    planId: {
      type: Schema.Types.ObjectId,
      ref: 'SubscriptionPlan',
      required: true,
      index: true,
    },
    stripePriceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['monthly', 'yearly'],
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
      index: true,
    },
    archivedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

PriceHistorySchema.index({ planId: 1, type: 1, isActive: 1 });
PriceHistorySchema.index({ planId: 1, archivedAt: -1 });

export const PriceHistoryModel = model<PriceHistoryDocument>('PriceHistory', PriceHistorySchema);

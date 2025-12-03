import { Schema, model, Document, Types } from 'mongoose';

export interface PaymentOrderDocument extends Document {
  companyId: Types.ObjectId;
  planId: Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: 'dummy' | 'stripe' | 'card';
  transactionId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentOrderSchema = new Schema<PaymentOrderDocument>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: 'SubscriptionPlan',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['dummy', 'stripe', 'card'],
      default: 'dummy',
    },
    transactionId: {
      type: String,
      sparse: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  },
);

PaymentOrderSchema.index({ companyId: 1, createdAt: -1 });
PaymentOrderSchema.index({ status: 1, createdAt: -1 });

export const PaymentOrderModel = model<PaymentOrderDocument>('PaymentOrder', PaymentOrderSchema);

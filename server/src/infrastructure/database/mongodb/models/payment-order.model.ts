import { Schema, model, Document, Types } from 'mongoose';
import { PaymentStatus } from '../../../../domain/enums/payment-status.enum';
import { PaymentMethod } from '../../../../domain/enums/payment-method.enum';
import { BillingCycle } from '../../../../domain/enums/billing-cycle.enum';

export interface PaymentOrderDocument extends Document {
  companyId: Types.ObjectId;
  planId: Types.ObjectId;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  invoiceId?: string;
  transactionId?: string;
  metadata?: Record<string, unknown>;
  stripePaymentIntentId?: string;
  stripeInvoiceId?: string;
  stripeInvoiceUrl?: string;
  stripeInvoicePdf?: string;
  subscriptionId?: Types.ObjectId;
  billingCycle?: BillingCycle;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentOrderSchema = new Schema<PaymentOrderDocument>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'CompanyProfile',
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
      default: 'INR',
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      default: PaymentMethod.DUMMY,
    },
    invoiceId: {
      type: String,
      unique: true,
      sparse: true,
    },
    transactionId: {
      type: String,
      sparse: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    stripePaymentIntentId: {
      type: String,
      sparse: true,
    },
    stripeInvoiceId: {
      type: String,
      sparse: true,
      index: true,
    },
    stripeInvoiceUrl: {
      type: String,
    },
    stripeInvoicePdf: {
      type: String,
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'CompanySubscription',
    },
    billingCycle: {
      type: String,
      enum: Object.values(BillingCycle),
    },
  },
  {
    timestamps: true,
  },
);

PaymentOrderSchema.index({ companyId: 1, createdAt: -1 });
PaymentOrderSchema.index({ status: 1, createdAt: -1 });

export const PaymentOrderModel = model<PaymentOrderDocument>('PaymentOrder', PaymentOrderSchema);

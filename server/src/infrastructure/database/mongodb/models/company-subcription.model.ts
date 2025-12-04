import { Schema, model, Document, Types } from 'mongoose';

export type SubscriptionStatusType = 'active' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'unpaid';

export interface CompanySubscriptionDocument extends Document {
  companyId: Types.ObjectId;
  planId: Types.ObjectId;
  startDate: Date;
  expiryDate: Date;
  isActive: boolean;
  jobPostsUsed: number;
  featuredJobsUsed: number;
  applicantAccessUsed: number;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripeStatus?: SubscriptionStatusType;
  billingCycle?: 'monthly' | 'yearly';
  cancelAtPeriodEnd?: boolean;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySubscriptionSchema = new Schema<CompanySubscriptionDocument>(
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
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
      index: true,
    },
    jobPostsUsed: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    featuredJobsUsed: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    applicantAccessUsed: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    stripeCustomerId: {
      type: String,
      sparse: true,
      index: true,
    },
    stripeSubscriptionId: {
      type: String,
      sparse: true,
      unique: true,
    },
    stripeStatus: {
      type: String,
      enum: ['active', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'trialing', 'unpaid'],
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
    currentPeriodStart: {
      type: Date,
    },
    currentPeriodEnd: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

CompanySubscriptionSchema.index({ companyId: 1, isActive: 1 });

export const CompanySubscriptionModel = model<CompanySubscriptionDocument>(
  'CompanySubscription',
  CompanySubscriptionSchema,
);
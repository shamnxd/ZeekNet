import { Schema, model, Document, Types } from 'mongoose';

export interface CompanySubscriptionDocument extends Document {
  companyId: Types.ObjectId;
  planId: Types.ObjectId;
  startDate: Date;
  expiryDate: Date;
  isActive: boolean;
  jobPostsUsed: number;
  featuredJobsUsed: number;
  applicantAccessUsed: number;
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
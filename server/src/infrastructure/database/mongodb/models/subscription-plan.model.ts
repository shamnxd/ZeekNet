import { Schema, model, Document } from 'mongoose';

export interface SubscriptionPlanDocument extends Document {
  name: string;
  description: string;
  price: number;
  duration: number;
  features: string[];
  jobPostLimit: number;
  featuredJobLimit: number;
  applicantAccessLimit: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionPlanSchema = new Schema<SubscriptionPlanDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 100,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    features: {
      type: [String],
      required: true,
      default: [],
    },
    jobPostLimit: {
      type: Number,
      required: true,
      min: 0,
    },
    featuredJobLimit: {
      type: Number,
      required: true,
      min: 0,
    },
    applicantAccessLimit: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const SubscriptionPlanModel = model<SubscriptionPlanDocument>('SubscriptionPlan', SubscriptionPlanSchema);

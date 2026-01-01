import { Schema, model, Document } from 'mongoose';

export interface SubscriptionPlanDocument extends Document {
  name: string;
  description: string;
  price: number;
  duration: number;
  yearlyDiscount: number;
  features: string[];
  jobPostLimit: number;
  featuredJobLimit: number;
  applicantAccessLimit: number;
  isActive: boolean;
  isPopular: boolean;
  isDefault: boolean;
  stripeProductId?: string;
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
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
      required: function(this: SubscriptionPlanDocument) {
        return !this.isDefault;
      },
      min: 0,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    yearlyDiscount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 100,
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
    isPopular: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDefault: {
      type: Boolean,
      required: true,
      default: false,
      index: true,
    },
    stripeProductId: {
      type: String,
      sparse: true,
      index: true,
    },
    stripePriceIdMonthly: {
      type: String,
      sparse: true,
    },
    stripePriceIdYearly: {
      type: String,
      sparse: true,
    },
  },
  {
    timestamps: true,
  },
);

export const SubscriptionPlanModel = model<SubscriptionPlanDocument>('SubscriptionPlan', SubscriptionPlanSchema);

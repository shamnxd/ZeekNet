import { Schema, model, Document, Types } from 'mongoose';

export interface JobPostingDocument extends Document {
  _id: Types.ObjectId;
  company_id: Types.ObjectId;

  title: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  nice_to_haves: string[];
  benefits: string[];

  salary: {
    min: number;
    max: number;
  };

  employment_types: string[];
  location: string;
  skills_required: string[];
  category_ids: string[];
  status: 'active' | 'unlisted' | 'expired' | 'blocked';
  unpublish_reason?: string;
  view_count: number;
  application_count: number;
  createdAt: Date;
  updatedAt: Date;
}

const JobPostingSchema = new Schema<JobPostingDocument>(
  {
    company_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'CompanyProfile',
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    responsibilities: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    qualifications: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    nice_to_haves: [
      {
        type: String,
        default: [],
        trim: true,
      },
    ],
    benefits: [
      {
        type: String,
        default: [],
        trim: true,
      },
    ],

    salary: {
      min: {
        type: Number,
        required: true,
        min: 0,
      },
      max: {
        type: Number,
        required: true,
        min: 0,
      },
    },

    employment_types: [
      {
        type: String,
        required: true,
        enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
        validate: {
          validator: function (arr: string[]) {
            return arr && arr.length > 0;
          },
          message: 'At least one employment type is required',
        },
      },
    ],
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    skills_required: [
      {
        type: String,
        index: true,
      },
    ],
    category_ids: [
      {
        type: String,
        required: true,
        index: true,
        validate: {
          validator: function (arr: string[]) {
            return arr && arr.length > 0;
          },
          message: 'At least one category is required',
        },
      },
    ],
    status: {
      type: String,
      enum: ['active', 'unlisted', 'expired', 'blocked'],
      default: 'active',
      required: true,
      index: true,
    },
    unpublish_reason: {
      type: String,
      trim: true,
    },
    view_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    application_count: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    collection: 'job_postings',
  },
);

JobPostingSchema.index({ company_id: 1, status: 1 });
JobPostingSchema.index({ category_ids: 1, status: 1 });
JobPostingSchema.index({ location: 1, status: 1 });
JobPostingSchema.index({ employment_types: 1, status: 1 });
JobPostingSchema.index({ 'salary.min': 1, 'salary.max': 1 });

JobPostingSchema.index({
  company_id: 1,
  createdAt: -1,
});

JobPostingSchema.index({
  category_ids: 1,
  location: 1,
  status: 1,
});

JobPostingSchema.index({
  title: 'text',
  description: 'text',
  location: 'text',
});

export const JobPostingModel = model<JobPostingDocument>('JobPosting', JobPostingSchema);
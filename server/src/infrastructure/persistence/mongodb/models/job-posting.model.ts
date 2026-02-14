import { Schema, model, Document, Types } from 'mongoose';
import { EmploymentType } from 'src/domain/enums/employment-type.enum';
import { JobStatus } from 'src/domain/enums/job-status.enum';
import { JobClosureType } from 'src/domain/enums/job-closure-type.enum';
import { ATSStage } from 'src/domain/enums/ats-stage.enum';


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

  employment_types: EmploymentType[];
  location: string;
  skills_required: string[];
  category_ids: string[];
  enabled_stages: ATSStage[];
  status: JobStatus;
  is_featured: boolean;
  unpublish_reason?: string;
  view_count: number;
  application_count: number;
  total_vacancies?: number;
  filled_vacancies?: number;
  closure_type?: JobClosureType;
  closed_at?: Date;
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
        enum: Object.values(EmploymentType),
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
    enabled_stages: [
      {
        type: String,
        enum: Object.values(ATSStage),
      },
    ],
    status: {
      type: String,
      enum: Object.values(JobStatus),
      default: JobStatus.ACTIVE,
      required: true,
      index: true,
    },
    is_featured: {
      type: Boolean,
      default: false,
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
    total_vacancies: {
      type: Number,
      default: 1,
      min: 1,
    },
    filled_vacancies: {
      type: Number,
      default: 0,
      min: 0,
    },
    closure_type: {
      type: String,
      enum: Object.values(JobClosureType),
    },
    closed_at: {
      type: Date,
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

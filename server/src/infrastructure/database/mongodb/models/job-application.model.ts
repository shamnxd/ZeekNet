import { Schema, model, Document, Types } from 'mongoose';
import { ATSStage, ATSSubStage, InReviewSubStage } from '../../../../domain/enums/ats-stage.enum';

export interface JobApplicationDocument extends Document {
  _id: Types.ObjectId;
  seeker_id: Types.ObjectId;
  job_id: Types.ObjectId;
  company_id: Types.ObjectId;
  cover_letter: string;
  resume_url: string;
  resume_filename: string;
  stage: ATSStage;
  sub_stage: ATSSubStage;
  ats_score?: number;
  score?: number;
  rejection_reason?: string;
  applied_date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema = new Schema<JobApplicationDocument>(
  {
    seeker_id: { type: Schema.Types.ObjectId, required: true, ref: 'User', index: true },
    job_id: { type: Schema.Types.ObjectId, required: true, ref: 'JobPosting', index: true },
    company_id: { type: Schema.Types.ObjectId, required: true, ref: 'CompanyProfile', index: true },
    cover_letter: { type: String, required: true, trim: true, minlength: 50, maxlength: 5000 },
    resume_url: { type: String, required: true, trim: true },
    resume_filename: { type: String, required: true, trim: true },
    stage: {
      type: String,
      enum: Object.values(ATSStage),
      default: ATSStage.IN_REVIEW,
      required: true,
      index: true,
    },
    sub_stage: {
      type: String,
      default: InReviewSubStage.PROFILE_REVIEW,
      required: true,
      index: true,
    },
    ats_score: { type: Number, min: 0, max: 100 },
    score: { type: Number, min: -1, max: 100 },
    rejection_reason: { type: String, trim: true },
    applied_date: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: true,
    collection: 'job_applications',
  },
);

// Indexes for efficient querying
JobApplicationSchema.index({ seeker_id: 1, job_id: 1 }, { unique: true });
JobApplicationSchema.index({ job_id: 1, stage: 1, sub_stage: 1 });
JobApplicationSchema.index({ company_id: 1, stage: 1 });
JobApplicationSchema.index({ seeker_id: 1, stage: 1 });
JobApplicationSchema.index({ applied_date: -1 });

export const JobApplicationModel = model<JobApplicationDocument>('JobApplication', JobApplicationSchema);

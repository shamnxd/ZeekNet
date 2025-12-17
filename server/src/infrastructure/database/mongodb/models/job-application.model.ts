import { Schema, model, Document, Types } from 'mongoose';

interface InterviewFeedback {
  reviewer_name: string;
  rating?: number;
  comment: string;
  reviewed_at: Date;
}

interface InterviewSchedule {
  _id?: Types.ObjectId;
  date: Date;
  time: string;
  interview_type: string;
  location: string;
  interviewer_name?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no-show';
  feedback?: InterviewFeedback;
  created_at?: Date;
  updated_at?: Date;
}

export interface JobApplicationDocument extends Document {
  _id: Types.ObjectId;
  seeker_id: Types.ObjectId;
  job_id: Types.ObjectId;
  company_id: Types.ObjectId;
  cover_letter: string;
  resume_url: string;
  resume_filename: string;
  stage: 'applied' | 'shortlisted' | 'interview' | 'rejected' | 'hired';
  score?: number;
  interviews: InterviewSchedule[];
  rejection_reason?: string;
  applied_date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewFeedbackSchema = new Schema<InterviewFeedback>(
  {
    reviewer_name: { type: String, required: true, trim: true },
    rating: { type: Number, min: 0, max: 5 },
    comment: { type: String, required: true, trim: true },
    reviewed_at: { type: Date, default: Date.now },
  },
  { _id: false },
);

const InterviewScheduleSchema = new Schema<InterviewSchedule>(
  {
    date: { type: Date, required: true },
    time: { type: String, required: true },
    interview_type: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    interviewer_name: { type: String, trim: true },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'rescheduled', 'no-show'],
      default: 'scheduled',
      required: true,
      index: true,
    },
    feedback: { type: InterviewFeedbackSchema },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { _id: true },
);

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
      enum: ['applied', 'shortlisted', 'interview', 'rejected', 'hired'],
      default: 'applied',
      index: true,
    },
    score: { type: Number, min: -1, max: 100 }, // -1 = processing, 0-100 = ATS score
    interviews: { type: [InterviewScheduleSchema], default: [] },
    rejection_reason: { type: String, trim: true },
    applied_date: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: true,
    collection: 'job_applications',
  },
);

JobApplicationSchema.index({ seeker_id: 1, job_id: 1 }, { unique: true });
JobApplicationSchema.index({ job_id: 1, stage: 1 });
JobApplicationSchema.index({ company_id: 1, stage: 1 });
JobApplicationSchema.index({ seeker_id: 1, stage: 1 });
JobApplicationSchema.index({ applied_date: -1 });
JobApplicationSchema.index({ 'interviews.date': 1, 'interviews.status': 1 });

export const JobApplicationModel = model<JobApplicationDocument>('JobApplication', JobApplicationSchema);



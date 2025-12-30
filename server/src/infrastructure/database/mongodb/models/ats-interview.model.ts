import mongoose, { Schema, Document } from 'mongoose';

export interface IATSInterviewDocument extends Document {
  applicationId: mongoose.Types.ObjectId;
  title: string;
  scheduledDate: Date;
  type: 'online' | 'offline';
  meetingLink?: string;
  location?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  rating?: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ATSInterviewSchema = new Schema<IATSInterviewDocument>(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'JobApplication',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ['online', 'offline'],
      required: true,
    },
    meetingLink: {
      type: String,
    },
    location: {
      type: String,
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
ATSInterviewSchema.index({ applicationId: 1, scheduledDate: -1 });
ATSInterviewSchema.index({ status: 1 });

export const ATSInterviewModel = mongoose.model<IATSInterviewDocument>('ATSInterview', ATSInterviewSchema);

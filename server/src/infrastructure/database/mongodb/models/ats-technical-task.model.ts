import mongoose, { Schema, Document } from 'mongoose';

export interface IATSTechnicalTaskDocument extends Document {
  applicationId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  deadline: Date;
  documentUrl?: string;
  documentFilename?: string;
  submissionUrl?: string;
  submissionFilename?: string;
  submissionLink?: string;
  submissionNote?: string;
  submittedAt?: Date;
  status: 'assigned' | 'submitted' | 'under_review' | 'completed' | 'cancelled';
  rating?: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ATSTechnicalTaskSchema = new Schema<IATSTechnicalTaskDocument>(
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
    description: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    documentUrl: {
      type: String,
    },
    documentFilename: {
      type: String,
    },
    submissionUrl: {
      type: String,
    },
    submissionFilename: {
      type: String,
    },
    submissionLink: {
      type: String,
    },
    submissionNote: {
      type: String,
    },
    submittedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['assigned', 'submitted', 'under_review', 'completed', 'cancelled'],
      default: 'assigned',
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
ATSTechnicalTaskSchema.index({ applicationId: 1, createdAt: -1 });
ATSTechnicalTaskSchema.index({ status: 1 });

export const ATSTechnicalTaskModel = mongoose.model<IATSTechnicalTaskDocument>('ATSTechnicalTask', ATSTechnicalTaskSchema);

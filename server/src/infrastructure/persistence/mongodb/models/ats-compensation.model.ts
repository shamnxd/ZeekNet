import mongoose, { Schema, Document } from 'mongoose';

export interface IATSCompensationDocument extends Document {
  applicationId: mongoose.Types.ObjectId;
  candidateExpected: string;
  companyProposed?: string;
  finalAgreed?: string;
  expectedJoining?: Date;
  benefits: string[];
  approvedAt?: Date;
  approvedBy?: mongoose.Types.ObjectId;
  approvedByName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ATSCompensationSchema = new Schema<IATSCompensationDocument>(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'JobApplication',
      required: true,
      index: true,
      unique: true,
    },
    candidateExpected: {
      type: String,
      required: true,
    },
    companyProposed: {
      type: String,
    },
    finalAgreed: {
      type: String,
    },
    expectedJoining: {
      type: Date,
    },
    benefits: {
      type: [String],
      default: [],
    },
    approvedAt: {
      type: Date,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedByName: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);



ATSCompensationSchema.index({ approvedAt: -1 });

export const ATSCompensationModel = mongoose.model<IATSCompensationDocument>('ATSCompensation', ATSCompensationSchema);



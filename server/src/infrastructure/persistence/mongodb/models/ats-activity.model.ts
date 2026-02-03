import mongoose, { Schema, Document } from 'mongoose';
import { ActivityType, ATSStage, ATSSubStage } from 'src/domain/enums/ats-stage.enum';

export interface IATSActivityDocument extends Document {
  applicationId: mongoose.Types.ObjectId;
  type: ActivityType;
  title: string;
  description: string;
  performedBy: mongoose.Types.ObjectId;
  performedByName?: string;
  stage?: ATSStage;
  subStage?: ATSSubStage;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const ATSActivitySchema = new Schema<IATSActivityDocument>(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'JobApplication',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(ActivityType),
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    performedByName: {
      type: String,
      required: false,
    },
    stage: {
      type: String,
      enum: Object.values(ATSStage),
    },
    subStage: {
      type: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);


ATSActivitySchema.index({ applicationId: 1, createdAt: -1 });

export const ATSActivityModel = mongoose.model<IATSActivityDocument>('ATSActivity', ATSActivitySchema);

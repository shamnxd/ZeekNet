import mongoose, { Schema, Document } from 'mongoose';
import { ATSStage, ATSSubStage } from '../../../../domain/enums/ats-stage.enum';

export interface IATSCommentDocument extends Document {
  applicationId: mongoose.Types.ObjectId;
  comment: string;
  addedBy: mongoose.Types.ObjectId;
  addedByName: string;
  stage: ATSStage;
  subStage?: ATSSubStage;
  createdAt: Date;
}

const ATSCommentSchema = new Schema<IATSCommentDocument>(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'JobApplication',
      required: true,
      index: true,
    },
    comment: {
      type: String,
      required: true,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    addedByName: {
      type: String,
      required: true,
    },
    stage: {
      type: String,
      enum: Object.values(ATSStage),
      required: true,
    },
    subStage: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

// Indexes
ATSCommentSchema.index({ applicationId: 1, createdAt: -1 });

export const ATSCommentModel = mongoose.model<IATSCommentDocument>('ATSComment', ATSCommentSchema);

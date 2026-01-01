import { Schema, model, Document, Types } from 'mongoose';

export interface SeekerEducationDocument extends Document {
  seekerProfileId: Types.ObjectId;
  school: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate: Date;
  endDate?: Date;
  grade?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SeekerEducationSchema = new Schema<SeekerEducationDocument>(
  {
    seekerProfileId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'SeekerProfile',
      index: true,
    },
    school: { type: String, required: true },
    degree: { type: String },
    fieldOfStudy: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    grade: { type: String },
  },
  { timestamps: true },
);

SeekerEducationSchema.index({ seekerProfileId: 1, createdAt: -1 });

export const SeekerEducationModel = model<SeekerEducationDocument>('SeekerEducation', SeekerEducationSchema);

import { Schema, model, Document, Types } from 'mongoose';

export interface SeekerExperienceDocument extends Document {
  seekerProfileId: Types.ObjectId;
  title: string;
  company: string;
  startDate: Date;
  endDate?: Date;
  employmentType: string;
  location?: string;
  description?: string;
  technologies: string[];
  isCurrent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SeekerExperienceSchema = new Schema<SeekerExperienceDocument>(
  {
    seekerProfileId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'SeekerProfile',
      index: true,
    },
    title: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    employmentType: { type: String, required: true },
    location: { type: String },
    description: { type: String },
    technologies: [{ type: String }],
    isCurrent: { type: Boolean, default: false },
  },
  { timestamps: true },
);

SeekerExperienceSchema.index({ seekerProfileId: 1, createdAt: -1 });

export const SeekerExperienceModel = model<SeekerExperienceDocument>('SeekerExperience', SeekerExperienceSchema);

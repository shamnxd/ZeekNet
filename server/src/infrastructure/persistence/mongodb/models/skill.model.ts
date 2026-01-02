import { Schema, model, Document } from 'mongoose';

export interface SkillDocument extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<SkillDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 100,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export const SkillModel = model<SkillDocument>('Skill', SkillSchema);

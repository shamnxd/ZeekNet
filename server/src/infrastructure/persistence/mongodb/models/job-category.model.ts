import { Schema, model, Document } from 'mongoose';

export interface JobCategoryDocument extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobCategorySchema = new Schema<JobCategoryDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 100,
    },
  },
  {
    timestamps: true,
  },
);

export const JobCategoryModel = model<JobCategoryDocument>('JobCategory', JobCategorySchema);

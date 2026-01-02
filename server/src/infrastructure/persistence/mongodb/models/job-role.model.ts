import { Schema, model, Document } from 'mongoose';

export interface JobRoleDocument extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobRoleSchema = new Schema<JobRoleDocument>(
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

export const JobRoleModel = model<JobRoleDocument>('JobRole', JobRoleSchema);


import { Schema, model, Document } from 'mongoose';

export interface CompanyTechStackDocument extends Document {
  companyId: string;
  techStack: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompanyTechStackSchema = new Schema<CompanyTechStackDocument>(
  {
    companyId: { type: String, required: true, ref: 'CompanyProfile' },
    techStack: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const CompanyTechStackModel = model<CompanyTechStackDocument>('CompanyTechStack', CompanyTechStackSchema);

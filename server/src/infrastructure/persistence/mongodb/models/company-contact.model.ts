import { Schema, model, Document } from 'mongoose';

export interface CompanyContactDocument extends Document {
  companyId: string;
  twitterLink: string;
  facebookLink: string;
  linkedin: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompanyContactSchema = new Schema<CompanyContactDocument>(
  {
    companyId: { type: String, required: true, ref: 'CompanyProfile' },
    twitterLink: { type: String, default: '' },
    facebookLink: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
  },
  {
    timestamps: true,
  },
);

export const CompanyContactModel = model<CompanyContactDocument>('CompanyContact', CompanyContactSchema);

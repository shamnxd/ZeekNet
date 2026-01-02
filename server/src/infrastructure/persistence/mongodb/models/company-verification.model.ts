import { Schema, model, Document } from 'mongoose';

export interface CompanyVerificationDocument extends Document {
  companyId: string;
  taxId: string;
  businessLicenseUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompanyVerificationSchema = new Schema<CompanyVerificationDocument>(
  {
    companyId: { type: String, required: true, ref: 'CompanyProfile' },
    taxId: { type: String, default: '' },
    businessLicenseUrl: { type: String, default: '' },
  },
  {
    timestamps: true,
  },
);

export const CompanyVerificationModel = model<CompanyVerificationDocument>('CompanyVerification', CompanyVerificationSchema);

import { Schema, model, Document } from 'mongoose';
import { CompanyVerificationStatus } from 'src/domain/enums/verification-status.enum';

export interface CompanyProfileDocument extends Document {
  userId: string;
  companyName: string;
  logo: string;
  banner: string;
  websiteLink: string;
  employeeCount: number;
  industry: string;
  organisation: string;
  aboutUs: string;
  foundedDate?: Date;
  phone?: string;
  isVerified: CompanyVerificationStatus;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompanyProfileSchema = new Schema<CompanyProfileDocument>(
  {
    userId: { type: String, required: true, ref: 'User' },
    companyName: { type: String, required: true },
    logo: { type: String, default: '' },
    banner: { type: String, default: '' },
    websiteLink: { type: String, default: '' },
    employeeCount: { type: Number, default: 0 },
    industry: { type: String, required: true },
    organisation: { type: String, required: true },
    aboutUs: { type: String, default: '' },
    foundedDate: { type: Date },
    phone: { type: String, default: '' },
    isVerified: { type: String, enum: Object.values(CompanyVerificationStatus), default: CompanyVerificationStatus.PENDING },
    rejectionReason: { type: String },
  },
  {
    timestamps: true,
  },
);

export const CompanyProfileModel = model<CompanyProfileDocument>('CompanyProfile', CompanyProfileSchema);

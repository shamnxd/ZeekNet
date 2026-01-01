import { Schema, model, Document } from 'mongoose';

import { Types } from 'mongoose';

export interface CompanyOfficeLocationDocument extends Document {
  companyId: Types.ObjectId;
  location: string;
  isHeadquarters: boolean;
  officeName?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompanyOfficeLocationSchema = new Schema<CompanyOfficeLocationDocument>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'CompanyProfile',
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    isHeadquarters: {
      type: Boolean,
      required: true,
      default: false,
    },
    officeName: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const CompanyOfficeLocationModel = model<CompanyOfficeLocationDocument>('CompanyOfficeLocation', CompanyOfficeLocationSchema);

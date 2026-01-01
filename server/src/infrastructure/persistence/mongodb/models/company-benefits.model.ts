import { Schema, model, Document } from 'mongoose';

import { Types } from 'mongoose';

export interface CompanyBenefitsDocument extends Document {
  companyId: Types.ObjectId;
  perk: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompanyBenefitsSchema = new Schema<CompanyBenefitsDocument>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'CompanyProfile',
      required: true,
    },
    perk: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const CompanyBenefitsModel = model<CompanyBenefitsDocument>('CompanyBenefits', CompanyBenefitsSchema);

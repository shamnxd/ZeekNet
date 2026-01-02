import { Schema, model, Document } from 'mongoose';

import { Types } from 'mongoose';

export interface CompanyWorkplacePicturesDocument extends Document {
  companyId: Types.ObjectId;
  pictureUrl: string;
  caption?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompanyWorkplacePicturesSchema = new Schema<CompanyWorkplacePicturesDocument>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'CompanyProfile',
      required: true,
    },
    pictureUrl: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const CompanyWorkplacePicturesModel = model<CompanyWorkplacePicturesDocument>('CompanyWorkplacePictures', CompanyWorkplacePicturesSchema);

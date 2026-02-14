import mongoose, { Schema, Document } from 'mongoose';

export interface IATSOfferDocument extends Document {
  applicationId: mongoose.Types.ObjectId;
  documentUrl?: string;
  offerAmount?: string;
  status: 'draft' | 'sent' | 'signed' | 'declined';
  signedDocumentUrl?: string;
  withdrawalReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ATSOfferSchema = new Schema<IATSOfferDocument>(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'JobApplication',
      required: true,
      index: true,
    },
    documentUrl: {
      type: String,
    },
    offerAmount: {
      type: String,
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'signed', 'declined'],
      default: 'draft',
    },
    signedDocumentUrl: {
      type: String,
    },
    withdrawalReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);


ATSOfferSchema.index({ applicationId: 1, createdAt: -1 });
ATSOfferSchema.index({ status: 1 });

export const ATSOfferModel = mongoose.model<IATSOfferDocument>('ATSOffer', ATSOfferSchema);

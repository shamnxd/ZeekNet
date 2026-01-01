import mongoose, { Schema, Document } from 'mongoose';

export interface IATSOfferDocument extends Document {
  applicationId: mongoose.Types.ObjectId;
  documentUrl: string;
  documentFilename: string;
  offerAmount?: string;
  status: 'draft' | 'sent' | 'signed' | 'declined';
  uploadedBy: mongoose.Types.ObjectId;
  uploadedByName: string;
  sentAt?: Date;
  signedAt?: Date;
  declinedAt?: Date;
  signedDocumentUrl?: string;
  signedDocumentFilename?: string;
  withdrawalReason?: string;
  withdrawnBy?: mongoose.Types.ObjectId;
  withdrawnByName?: string;
  withdrawnAt?: Date;
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
      required: true,
    },
    documentFilename: {
      type: String,
      required: true,
    },
    offerAmount: {
      type: String,
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'signed', 'declined'],
      default: 'draft',
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    uploadedByName: {
      type: String,
      required: true,
    },
    sentAt: {
      type: Date,
    },
    signedAt: {
      type: Date,
    },
    declinedAt: {
      type: Date,
    },
    signedDocumentUrl: {
      type: String,
    },
    signedDocumentFilename: {
      type: String,
    },
    withdrawalReason: {
      type: String,
    },
    withdrawnBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    withdrawnByName: {
      type: String,
    },
    withdrawnAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
ATSOfferSchema.index({ applicationId: 1, createdAt: -1 });
ATSOfferSchema.index({ status: 1 });

export const ATSOfferModel = mongoose.model<IATSOfferDocument>('ATSOffer', ATSOfferSchema);

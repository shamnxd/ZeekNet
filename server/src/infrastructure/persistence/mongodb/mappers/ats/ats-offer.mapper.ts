import { Types } from 'mongoose';
import { ATSOffer } from '../../../../../domain/entities/ats-offer.entity';
import { IATSOfferDocument } from '../../models/ats-offer.model';

export class ATSOfferMapper {
  static toEntity(doc: IATSOfferDocument): ATSOffer {
    return new ATSOffer(
      (doc._id as Types.ObjectId).toString(),
      doc.applicationId.toString(),
      doc.documentUrl,
      doc.documentFilename,
      doc.offerAmount,
      doc.status,
      doc.uploadedBy.toString(),
      doc.uploadedByName,
      doc.sentAt,
      doc.signedAt,
      doc.declinedAt,
      doc.signedDocumentUrl,
      doc.signedDocumentFilename,
      doc.withdrawalReason,
      doc.withdrawnBy?.toString(),
      doc.withdrawnByName,
      doc.withdrawnAt,
      doc.createdAt,
      doc.updatedAt,
    );
  }

  static toDocument(offer: ATSOffer): Partial<IATSOfferDocument> {
    return {
      applicationId: new Types.ObjectId(offer.applicationId),
      documentUrl: offer.documentUrl,
      documentFilename: offer.documentFilename,
      offerAmount: offer.offerAmount,
      status: offer.status,
      uploadedBy: new Types.ObjectId(offer.uploadedBy),
      uploadedByName: offer.uploadedByName,
      sentAt: offer.sentAt,
      signedAt: offer.signedAt,
      declinedAt: offer.declinedAt,
      signedDocumentUrl: offer.signedDocumentUrl,
      signedDocumentFilename: offer.signedDocumentFilename,
      withdrawalReason: offer.withdrawalReason,
      withdrawnBy: offer.withdrawnBy ? new Types.ObjectId(offer.withdrawnBy) : undefined,
      withdrawnByName: offer.withdrawnByName,
      withdrawnAt: offer.withdrawnAt,
    };
  }
}


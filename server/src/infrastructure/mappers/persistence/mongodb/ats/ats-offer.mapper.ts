import { Types } from 'mongoose';
import { ATSOffer } from 'src/domain/entities/ats-offer.entity';
import { IATSOfferDocument } from 'src/infrastructure/persistence/mongodb/models/ats-offer.model';

export class ATSOfferMapper {
  static toEntity(doc: IATSOfferDocument): ATSOffer {
    return new ATSOffer(
      (doc._id as Types.ObjectId).toString(),
      doc.applicationId.toString(),
      doc.documentUrl,
      doc.offerAmount,
      doc.status,
      doc.signedDocumentUrl,
      doc.withdrawalReason,
      doc.createdAt,
      doc.updatedAt,
    );
  }

  static toDocument(offer: ATSOffer): Partial<IATSOfferDocument> {
    return {
      applicationId: new Types.ObjectId(offer.applicationId),
      documentUrl: offer.documentUrl,
      offerAmount: offer.offerAmount,
      status: offer.status,
      signedDocumentUrl: offer.signedDocumentUrl,
      withdrawalReason: offer.withdrawalReason,
    };
  }
}


import { ATSOffer } from 'src/domain/entities/ats-offer.entity';
import { ATSOfferResponseDto } from 'src/application/dtos/application/offer/responses/ats-offer-response.dto';

export class ATSOfferMapper {
  static toResponse(offer: ATSOffer): ATSOfferResponseDto {
    return {
      id: offer.id,
      applicationId: offer.applicationId,
      documentUrl: offer.documentUrl,
      documentFilename: offer.documentFilename,
      offerAmount: offer.offerAmount,
      status: offer.status,
      uploadedBy: offer.uploadedBy,
      uploadedByName: offer.uploadedByName,
      signedDocumentUrl: offer.signedDocumentUrl,
      signedDocumentFilename: offer.signedDocumentFilename,
      signedAt: offer.signedAt,
      declinedAt: offer.declinedAt,
      withdrawalReason: offer.withdrawalReason,
      withdrawnBy: offer.withdrawnBy,
      withdrawnByName: offer.withdrawnByName,
      withdrawnAt: offer.withdrawnAt,
      createdAt: offer.createdAt,
      updatedAt: offer.updatedAt,
    };
  }

  static toResponseList(offers: ATSOffer[]): ATSOfferResponseDto[] {
    return offers.map((offer) => this.toResponse(offer));
  }
}

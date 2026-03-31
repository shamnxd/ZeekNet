import { ATSOffer } from 'src/domain/entities/ats-offer.entity';
import { ATSOfferResponseDto } from 'src/application/dtos/application/offer/responses/ats-offer-response.dto';

export class ATSOfferMapper {
  static toResponse(offer: ATSOffer): ATSOfferResponseDto {
    return {
      id: offer.id,
      applicationId: offer.applicationId,
      documentUrl: offer.documentUrl,
      offerAmount: offer.offerAmount,
      status: offer.status,
      signedDocumentUrl: offer.signedDocumentUrl,
      withdrawalReason: offer.withdrawalReason,
      createdAt: offer.createdAt,
      updatedAt: offer.updatedAt,
    };
  }

  static toResponseList(offers: ATSOffer[]): ATSOfferResponseDto[] {
    return offers.map((offer) => this.toResponse(offer));
  }
}

import { UploadOfferRequestDto } from 'src/application/dtos/application/offer/requests/upload-offer.dto';
import { ATSOfferResponseDto } from 'src/application/dtos/application/offer/responses/ats-offer-response.dto';

export interface IUploadOfferUseCase {
  execute(dto: UploadOfferRequestDto): Promise<ATSOfferResponseDto>;
}

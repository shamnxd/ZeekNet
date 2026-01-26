import { ATSOfferResponseDto } from 'src/application/dtos/application/offer/responses/ats-offer-response.dto';
import { UpdateOfferStatusRequestDto } from 'src/application/dtos/application/offer/requests/update-offer-status-request.dto';

export interface IUpdateOfferStatusUseCase {
  execute(data: UpdateOfferStatusRequestDto): Promise<ATSOfferResponseDto>;
}

import { ATSOfferResponseDto } from 'src/application/dtos/application/offer/responses/ats-offer-response.dto';

export interface IGetOffersByApplicationUseCase {
  execute(applicationId: string): Promise<ATSOfferResponseDto[]>;
}


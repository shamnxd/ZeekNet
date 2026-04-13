import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { IGetOffersByApplicationUseCase } from 'src/domain/interfaces/use-cases/application/offer/IGetOffersByApplicationUseCase';
import { IATSOfferRepository } from 'src/domain/interfaces/repositories/ats/IATSOfferRepository';
import { ATSOfferResponseDto } from 'src/application/dtos/application/offer/responses/ats-offer-response.dto';
import { ATSOfferMapper } from 'src/application/mappers/ats/ats-offer.mapper';

@injectable()
export class GetOffersByApplicationUseCase implements IGetOffersByApplicationUseCase {
  constructor(
    @inject(TYPES.ATSOfferRepository) private offerRepository: IATSOfferRepository,
  ) {}

  async execute(applicationId: string): Promise<ATSOfferResponseDto[]> {
    const offers = await this.offerRepository.findByApplicationId(applicationId);
    return ATSOfferMapper.toResponseList(offers);
  }
}

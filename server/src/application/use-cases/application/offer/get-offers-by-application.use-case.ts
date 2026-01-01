import { IGetOffersByApplicationUseCase } from 'src/domain/interfaces/use-cases/application/offer/IGetOffersByApplicationUseCase';
import { IATSOfferRepository } from 'src/domain/interfaces/repositories/ats/IATSOfferRepository';
import { ATSOffer } from 'src/domain/entities/ats-offer.entity';

export class GetOffersByApplicationUseCase implements IGetOffersByApplicationUseCase {
  constructor(private offerRepository: IATSOfferRepository) {}

  async execute(applicationId: string): Promise<ATSOffer[]> {
    return await this.offerRepository.findByApplicationId(applicationId);
  }
}


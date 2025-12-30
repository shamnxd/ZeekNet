import { IGetOffersByApplicationUseCase } from '../../../domain/interfaces/use-cases/ats/IGetOffersByApplicationUseCase';
import { IATSOfferRepository } from '../../../domain/interfaces/repositories/ats/IATSOfferRepository';
import { ATSOffer } from '../../../domain/entities/ats-offer.entity';

export class GetOffersByApplicationUseCase implements IGetOffersByApplicationUseCase {
  constructor(private offerRepository: IATSOfferRepository) {}

  async execute(applicationId: string): Promise<ATSOffer[]> {
    return await this.offerRepository.findByApplicationId(applicationId);
  }
}


import { ATSOffer } from 'src/domain/entities/ats-offer.entity';

export interface IGetOffersByApplicationUseCase {
  execute(applicationId: string): Promise<ATSOffer[]>;
}


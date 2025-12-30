import { ATSOffer } from '../../../entities/ats-offer.entity';

export interface IGetOffersByApplicationUseCase {
  execute(applicationId: string): Promise<ATSOffer[]>;
}


import { ATSOffer } from '../../../entities/ats-offer.entity';

export interface IUpdateOfferStatusUseCase {
  execute(userId: string, offerId: string, status: 'signed' | 'declined'): Promise<ATSOffer>;
}

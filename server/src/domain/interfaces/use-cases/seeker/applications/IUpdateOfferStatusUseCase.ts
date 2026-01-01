import { ATSOffer } from 'src/domain/entities/ats-offer.entity';

export interface IUpdateOfferStatusUseCase {
  execute(userId: string, offerId: string, status: 'signed' | 'declined'): Promise<ATSOffer>;
}

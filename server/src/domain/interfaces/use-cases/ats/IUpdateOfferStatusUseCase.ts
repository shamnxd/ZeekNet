import { ATSOffer } from '../../../entities/ats-offer.entity';

export interface IUpdateOfferStatusUseCase {
  execute(data: {
    offerId: string;
    status: 'draft' | 'sent' | 'signed' | 'declined';
    withdrawalReason?: string;
    performedBy: string;
    performedByName: string;
  }): Promise<ATSOffer>;
}


import { PriceHistory, PriceType } from '../../../entities/price-history.entity';

export interface IPriceHistoryRepository {
  create(data: {
    planId: string;
    stripePriceId: string;
    type: PriceType;
    amount: number;
    isActive?: boolean;
  }): Promise<PriceHistory>;

  findByPlanId(planId: string): Promise<PriceHistory[]>;
  
  findActiveByPlanIdAndType(planId: string, type: PriceType): Promise<PriceHistory | null>;
  
  findLastArchivedByPlanIdAndType(planId: string, type: PriceType): Promise<PriceHistory | null>;
  
  findByStripePriceId(stripePriceId: string): Promise<PriceHistory | null>;
  
  archivePrice(stripePriceId: string): Promise<PriceHistory | null>;
  
  archiveAllByPlanId(planId: string): Promise<void>;
}

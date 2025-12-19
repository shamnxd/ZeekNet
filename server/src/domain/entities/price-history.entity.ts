import { PriceType } from '../enums/price-type.enum';

export { PriceType };
export class PriceHistory {
  constructor(
    public readonly id: string,
    public readonly planId: string,
    public readonly stripePriceId: string,
    public readonly type: PriceType,
    public readonly amount: number, 
    public readonly isActive: boolean, 
    public readonly createdAt: Date,
    public readonly archivedAt: Date | null,
  ) {}

  static create(data: {
    id: string;
    planId: string;
    stripePriceId: string;
    type: PriceType;
    amount: number;
    isActive?: boolean;
    createdAt?: Date;
    archivedAt?: Date | null;
  }): PriceHistory {
    const now = new Date();
    return new PriceHistory(
      data.id,
      data.planId,
      data.stripePriceId,
      data.type,
      data.amount,
      data.isActive ?? true,
      data.createdAt ?? now,
      data.archivedAt ?? null,
    );
  }
}

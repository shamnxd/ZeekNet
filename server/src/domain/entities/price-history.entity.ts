export type PriceType = 'monthly' | 'yearly';

export class PriceHistory {
  constructor(
    public readonly id: string,
    public readonly planId: string,
    public readonly stripePriceId: string,
    public readonly type: PriceType,
    public readonly amount: number, // Amount in rupees
    public readonly isActive: boolean, // Current active price or archived
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

  archive(): PriceHistory {
    return new PriceHistory(
      this.id,
      this.planId,
      this.stripePriceId,
      this.type,
      this.amount,
      false,
      this.createdAt,
      new Date(),
    );
  }
}

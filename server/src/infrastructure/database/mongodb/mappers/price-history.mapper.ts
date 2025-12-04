import { PriceHistory } from '../../../../domain/entities/price-history.entity';
import { PriceHistoryDocument } from '../models/price-history.model';

export class PriceHistoryMapper {
  static toEntity(doc: PriceHistoryDocument): PriceHistory {
    return PriceHistory.create({
      id: String(doc._id),
      planId: String(doc.planId),
      stripePriceId: doc.stripePriceId,
      type: doc.type,
      amount: doc.amount,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      archivedAt: doc.archivedAt,
    });
  }
}

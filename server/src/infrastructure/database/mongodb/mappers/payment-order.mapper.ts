import { PaymentOrder, PaymentStatus, PaymentMethod } from '../../../../domain/entities/payment-order.entity';
import { PaymentOrderDocument } from '../models/payment-order.model';

export class PaymentOrderMapper {
  static toEntity(doc: PaymentOrderDocument): PaymentOrder {
    return PaymentOrder.create({
      id: String(doc._id),
      companyId: String(doc.companyId),
      planId: String(doc.planId),
      amount: doc.amount,
      currency: doc.currency,
      status: doc.status as PaymentStatus,
      paymentMethod: doc.paymentMethod as PaymentMethod,
      invoiceId: doc.invoiceId,
      transactionId: doc.transactionId,
      metadata: doc.metadata,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toDocument(entity: PaymentOrder): Partial<PaymentOrderDocument> {
    return {
      companyId: entity.companyId as unknown as PaymentOrderDocument['companyId'],
      planId: entity.planId as unknown as PaymentOrderDocument['planId'],
      amount: entity.amount,
      currency: entity.currency,
      status: entity.status,
      paymentMethod: entity.paymentMethod,
      invoiceId: entity.invoiceId,
      transactionId: entity.transactionId,
      metadata: entity.metadata,
    };
  }
}

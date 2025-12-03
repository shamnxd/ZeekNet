import { PaymentOrder, PaymentStatus, PaymentMethod } from '../../../../domain/entities/payment-order.entity';
import { PaymentOrderDocument } from '../models/payment-order.model';

export class PaymentOrderMapper {
  static toEntity(doc: PaymentOrderDocument): PaymentOrder {
    const companyId = (doc as any).companyId && typeof (doc as any).companyId === 'object'
      ? String((doc as any).companyId._id || (doc as any).companyId)
      : String(doc.companyId);
    const planId = (doc as any).planId && typeof (doc as any).planId === 'object'
      ? String((doc as any).planId._id || (doc as any).planId)
      : String(doc.planId);
    return PaymentOrder.create({
      id: String(doc._id),
      companyId,
      planId,
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

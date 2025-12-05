import { PaymentOrder, PaymentStatus, PaymentMethod } from '../../../../domain/entities/payment-order.entity';
import { PaymentOrderDocument } from '../models/payment-order.model';
import { Types } from 'mongoose';

export class PaymentOrderMapper {
  static toEntity(doc: PaymentOrderDocument): PaymentOrder {
    const companyId = doc.companyId instanceof Types.ObjectId 
      ? doc.companyId.toString() 
      : String(doc.companyId);
    const planId = doc.planId instanceof Types.ObjectId 
      ? doc.planId.toString() 
      : String(doc.planId);
    const subscriptionId = doc.subscriptionId 
      ? (doc.subscriptionId instanceof Types.ObjectId ? doc.subscriptionId.toString() : String(doc.subscriptionId))
      : undefined;
    
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
      stripePaymentIntentId: doc.stripePaymentIntentId,
      stripeInvoiceId: doc.stripeInvoiceId,
      stripeInvoiceUrl: doc.stripeInvoiceUrl,
      stripeInvoicePdf: doc.stripeInvoicePdf,
      subscriptionId,
      billingCycle: doc.billingCycle,
    });
  }

  static toDocument(entity: PaymentOrder): Partial<PaymentOrderDocument> {
    const doc: Partial<PaymentOrderDocument> = {
      companyId: new Types.ObjectId(entity.companyId),
      planId: new Types.ObjectId(entity.planId),
      amount: entity.amount,
      currency: entity.currency,
      status: entity.status,
      paymentMethod: entity.paymentMethod,
      invoiceId: entity.invoiceId,
      transactionId: entity.transactionId,
      metadata: entity.metadata,
    };
    
    if (entity.stripePaymentIntentId) doc.stripePaymentIntentId = entity.stripePaymentIntentId;
    if (entity.stripeInvoiceId) doc.stripeInvoiceId = entity.stripeInvoiceId;
    if (entity.stripeInvoiceUrl) doc.stripeInvoiceUrl = entity.stripeInvoiceUrl;
    if (entity.stripeInvoicePdf) doc.stripeInvoicePdf = entity.stripeInvoicePdf;
    if (entity.subscriptionId) doc.subscriptionId = new Types.ObjectId(entity.subscriptionId);
    if (entity.billingCycle) doc.billingCycle = entity.billingCycle;
    
    return doc;
  }
}

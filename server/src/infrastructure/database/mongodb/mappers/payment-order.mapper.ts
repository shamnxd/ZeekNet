import { PaymentOrder } from '../../../../domain/entities/payment-order.entity';
import { PaymentStatus } from '../../../../domain/enums/payment-status.enum';
import { PaymentMethod } from '../../../../domain/enums/payment-method.enum';
import { BillingCycle } from '../../../../domain/enums/billing-cycle.enum';
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
      billingCycle: doc.billingCycle as BillingCycle,
    });
  }

  static toDocument(entity: Partial<PaymentOrder>): Partial<PaymentOrderDocument> {
    const doc: Partial<PaymentOrderDocument> = {};
    
    if (entity.companyId) doc.companyId = new Types.ObjectId(entity.companyId);
    if (entity.planId) doc.planId = new Types.ObjectId(entity.planId);
    if (entity.amount !== undefined) doc.amount = entity.amount;
    if (entity.currency) doc.currency = entity.currency;
    if (entity.status) doc.status = entity.status;
    if (entity.paymentMethod) doc.paymentMethod = entity.paymentMethod;
    if (entity.invoiceId !== undefined) doc.invoiceId = entity.invoiceId;
    if (entity.transactionId !== undefined) doc.transactionId = entity.transactionId;
    if (entity.metadata !== undefined) doc.metadata = entity.metadata;
    if (entity.stripePaymentIntentId) doc.stripePaymentIntentId = entity.stripePaymentIntentId;
    if (entity.stripeInvoiceId) doc.stripeInvoiceId = entity.stripeInvoiceId;
    if (entity.stripeInvoiceUrl) doc.stripeInvoiceUrl = entity.stripeInvoiceUrl;
    if (entity.stripeInvoicePdf) doc.stripeInvoicePdf = entity.stripeInvoicePdf;
    if (entity.subscriptionId) doc.subscriptionId = new Types.ObjectId(entity.subscriptionId);
    if (entity.billingCycle) doc.billingCycle = entity.billingCycle;
    
    return doc;
  }
}

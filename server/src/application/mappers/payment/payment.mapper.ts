import { PaymentOrder } from 'src/domain/entities/payment-order.entity';
import { PaymentResponseDto } from 'src/application/dtos/payment/responses/payment-response.dto';
import { PaymentStatus } from 'src/domain/enums/payment-status.enum';
import { PaymentMethod } from 'src/domain/enums/payment-method.enum';
import { BillingCycle } from 'src/domain/enums/billing-cycle.enum';
import { PaymentOrderWithDetailsResponseDto } from 'src/application/dtos/payment/responses/payment-order-with-details-response.dto';
import { CreateInput } from 'src/domain/types/common.types';

export class PaymentMapper {
  static toEntity(data: {
    companyId: string;
    planId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    paymentMethod: PaymentMethod;
    invoiceId?: string;
    transactionId?: string;
    stripeInvoiceId?: string;
    stripeInvoiceUrl?: string;
    stripeInvoicePdf?: string;
    stripePaymentIntentId?: string;
    subscriptionId?: string;
    billingCycle?: BillingCycle;
    metadata?: Record<string, unknown>;
  }): CreateInput<PaymentOrder> {
    return {
      companyId: data.companyId,
      planId: data.planId,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
      paymentMethod: data.paymentMethod,
      invoiceId: data.invoiceId,
      transactionId: data.transactionId,
      stripeInvoiceId: data.stripeInvoiceId,
      stripeInvoiceUrl: data.stripeInvoiceUrl,
      stripeInvoicePdf: data.stripeInvoicePdf,
      stripePaymentIntentId: data.stripePaymentIntentId,
      subscriptionId: data.subscriptionId,
      billingCycle: data.billingCycle,
      metadata: data.metadata,
    };
  }

  static toResponse(order: PaymentOrder): PaymentResponseDto {
    return {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      paymentMethod: order.paymentMethod,
      invoiceId: order.invoiceId,
      transactionId: order.transactionId,
      stripeInvoiceUrl: order.stripeInvoiceUrl,
      stripeInvoicePdf: order.stripeInvoicePdf,
      billingCycle: order.billingCycle,
      createdAt: order.createdAt,
    };
  }

  static toResponseList(orders: PaymentOrder[]): PaymentResponseDto[] {
    return orders.map((order) => this.toResponse(order));
  }

  static toAdminListItemResponse(
    order: PaymentOrder,
    companyName: string = 'Unknown Company',
    planName: string = 'Unknown Plan',
  ): PaymentOrderWithDetailsResponseDto {
    return {
      id: order.id,
      orderNo: order.invoiceId || `#${order.id.slice(-9).toUpperCase()}`,
      companyId: order.companyId,
      companyName,
      planId: order.planId,
      planName,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      paymentMethod: order.paymentMethod,
      invoiceId: order.invoiceId,
      transactionId: order.transactionId,
      createdAt: order.createdAt || new Date(),
      updatedAt: order.updatedAt || new Date(),
    };
  }
}



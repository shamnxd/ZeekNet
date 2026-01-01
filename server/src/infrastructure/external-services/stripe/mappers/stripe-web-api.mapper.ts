import Stripe from 'stripe';
import {
  PaymentCustomer,
  PaymentProduct,
  PaymentPrice,
  PaymentSession,
  PaymentSubscription,
  PaymentBillingPortalSession,
  PaymentEvent,
  PaymentInvoice,
  PaymentSubscriptionItem,
  PaymentInvoiceLineItem,
} from '../../../../domain/types/payment/payment-types';

export class StripeWebApiMapper {
  static mapCustomer(customer: Stripe.Customer | Stripe.DeletedCustomer): PaymentCustomer {
    if (customer.deleted) {
      return { id: customer.id, deleted: true };
    }
    return {
      id: customer.id,
      email: customer.email,
      name: customer.name,
      metadata: customer.metadata,
      deleted: false,
    };
  }

  static mapProduct(product: Stripe.Product): PaymentProduct {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      active: product.active,
      metadata: product.metadata,
    };
  }

  static mapPrice(price: Stripe.Price): PaymentPrice {
    const interval = price.recurring?.interval;
    let mappedInterval: 'month' | 'year' | undefined;
    
    if (interval === 'month' || interval === 'year') {
      mappedInterval = interval;
    }

    return {
      id: price.id,
      productId: typeof price.product === 'string' ? price.product : this.mapProduct(price.product as Stripe.Product),
      unitAmount: price.unit_amount,
      currency: price.currency,
      recurring: mappedInterval ? { interval: mappedInterval } : null,
      active: price.active,
      metadata: price.metadata,
    };
  }

  static mapSubscriptionItem(item: Stripe.SubscriptionItem): PaymentSubscriptionItem {
    return {
      id: item.id,
      price: this.mapPrice(item.price),
    };
  }

  static mapInvoice(invoice: Stripe.Invoice): PaymentInvoice {
    const lines = invoice.lines?.data?.map(l => ({
      id: l.id,
      subscription: typeof l.subscription === 'string' ? l.subscription : (l.subscription as Stripe.Subscription)?.id
    } as PaymentInvoiceLineItem)) || [];

    // Cast to any to access fields that might be missing in strict types but exist in API
    const invoiceAny = invoice as any;

    return {
      id: invoice.id,
      number: invoice.number,
      amountPaid: invoice.amount_paid,
      amountDue: invoice.amount_due,
      currency: invoice.currency,
      status: invoice.status,
      paymentIntent: typeof invoiceAny.payment_intent === 'string' ? invoiceAny.payment_intent : invoiceAny.payment_intent?.id,
      hostedInvoiceUrl: invoice.hosted_invoice_url,
      invoicePdf: invoice.invoice_pdf,
      billingReason: invoice.billing_reason,
      lines: { data: lines },
      subscription: typeof invoiceAny.subscription === 'string' ? invoiceAny.subscription : (invoiceAny.subscription as Stripe.Subscription)?.id,
    };
  }

  static mapSubscription(subscription: Stripe.Subscription): PaymentSubscription {
    const subscriptionAny = subscription as any;
    const items = subscription.items.data.map(i => this.mapSubscriptionItem(i));
    return {
      id: subscription.id,
      status: subscription.status,
      customerId: typeof subscription.customer === 'string' ? subscription.customer : this.mapCustomer(subscription.customer as Stripe.Customer),
      startDate: subscription.start_date,
      created: subscription.created,
      currentPeriodStart: subscriptionAny.current_period_start,
      currentPeriodEnd: subscriptionAny.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      items: { data: items },
      latestInvoice: typeof subscriptionAny.latest_invoice === 'string' 
        ? subscriptionAny.latest_invoice 
        : (subscriptionAny.latest_invoice ? this.mapInvoice(subscriptionAny.latest_invoice as Stripe.Invoice) : null),
      metadata: subscription.metadata,
    };
  }

  static mapSession(session: Stripe.Checkout.Session): PaymentSession {
    return {
      id: session.id,
      url: session.url ?? undefined,
      customerId: typeof session.customer === 'string' ? session.customer : session.customer?.id,
      subscription: typeof session.subscription === 'string' ? session.subscription : (session.subscription ? this.mapSubscription(session.subscription as Stripe.Subscription) : null),
      metadata: session.metadata,
      paymentStatus: session.payment_status,
    };
  }

  static mapEvent(event: Stripe.Event): PaymentEvent {
    let objectData: any = event.data.object;

    // We only map specific types we care about to avoid mapping everything
    if (event.type.startsWith('customer.subscription.')) {
      objectData = this.mapSubscription(event.data.object as Stripe.Subscription);
    } else if (event.type.startsWith('invoice.')) {
      objectData = this.mapInvoice(event.data.object as Stripe.Invoice);
    } else if (event.type.startsWith('checkout.session.')) {
      objectData = this.mapSession(event.data.object as Stripe.Checkout.Session);
    }

    return {
      type: event.type,
      data: {
        object: objectData,
      },
    };
  }
}

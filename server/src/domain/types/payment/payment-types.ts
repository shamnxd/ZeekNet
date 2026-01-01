export interface PaymentCustomer {
  id: string;
  email?: string | null;
  name?: string | null;
  metadata?: Record<string, string>;
  deleted?: boolean;
}

export interface PaymentProduct {
  id: string;
  name: string;
  description?: string | null;
  active: boolean;
  metadata?: Record<string, string>;
}

export interface PaymentPrice {
  id: string;
  productId: string | PaymentProduct;
  unitAmount: number | null;
  currency: string;
  recurring?: {
    interval: 'month' | 'year';
  } | null;
  active: boolean;
  metadata?: Record<string, string>;
}

export interface PaymentSubscriptionItem {
  id: string;
  price: PaymentPrice;
}

export interface PaymentSubscription {
  id: string;
  status: string;
  customerId: string | PaymentCustomer;
  startDate: number;
  created: number;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  items: {
    data: PaymentSubscriptionItem[];
  };
  latestInvoice?: string | PaymentInvoice | null;
  metadata?: Record<string, string>;
}

export interface PaymentInvoiceLineItem {
  id: string;
  subscription?: string | null;
}

export interface PaymentInvoice {
  id: string;
  number: string | null;
  amountPaid: number;
  amountDue: number;
  currency: string;
  status: string | null;
  paymentIntent?: string | { id: string } | null;
  hostedInvoiceUrl?: string | null;
  invoicePdf?: string | null;
  billingReason?: string | null;
  lines?: {
    data: PaymentInvoiceLineItem[];
  };
  subscription?: string | null;
}

export interface PaymentSession {
  id: string;
  url?: string | null;
  customerId?: string | null;
  subscription?: string | PaymentSubscription | null;
  metadata?: Record<string, string> | null;
  paymentStatus: string;
}

export interface PaymentEvent {
  type: string;
  data: {
    object: PaymentSession | PaymentInvoice | PaymentSubscription | Record<string, any>;
  };
}

export interface PaymentBillingPortalSession {
  id: string;
  url: string;
  returnUrl?: string;
}

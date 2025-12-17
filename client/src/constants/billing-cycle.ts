export const BillingCycle = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
} as const;

export type BillingCycle = typeof BillingCycle[keyof typeof BillingCycle];

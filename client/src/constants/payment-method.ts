export const PaymentMethod = {
  DUMMY: 'dummy',
  STRIPE: 'stripe',
  CARD: 'card',
} as const;

export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

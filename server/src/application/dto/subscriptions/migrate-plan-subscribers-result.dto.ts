export interface MigratePlanSubscribersResult {
  planId: string;
  planName: string;
  billingCycle: 'monthly' | 'yearly' | 'both';
  fromPriceId: string;
  toPriceId: string;
  migratedCount: number;
  failedCount: number;
  errors: string[];
}














export interface PreviewPlanChangeRequestDto {
    userId: string;
    newPlanId: string;
    billingCycle?: 'monthly' | 'yearly';
}

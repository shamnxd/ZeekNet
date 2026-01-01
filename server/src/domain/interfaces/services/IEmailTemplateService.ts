export interface IEmailTemplateService {
  getSubscriptionMigrationEmail(
    planName: string,
    oldPrice: number,
    newPrice: number,
    billingCycle: 'monthly' | 'yearly',
    companyName?: string,
  ): { subject: string; html: string };

  getOtpVerificationEmail(code: string): { subject: string; html: string };
}

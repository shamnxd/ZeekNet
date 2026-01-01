import { IEmailTemplateService } from '../../domain/interfaces/services/IEmailTemplateService';
import { subscriptionMigrationTemplate } from '../messaging/templates/subscription-migration.template';
import { otpVerificationTemplate } from '../messaging/templates/otp-verification.template';

export class EmailTemplateService implements IEmailTemplateService {
  getSubscriptionMigrationEmail(
    planName: string,
    oldPrice: number,
    newPrice: number,
    billingCycle: 'monthly' | 'yearly',
    companyName?: string,
  ): { subject: string; html: string } {
    const subject = subscriptionMigrationTemplate.subject(planName);
    const html = subscriptionMigrationTemplate.html(planName, oldPrice, newPrice, billingCycle, companyName);
    return { subject, html };
  }

  getOtpVerificationEmail(code: string): { subject: string; html: string } {
    const subject = otpVerificationTemplate.subject;
    const html = otpVerificationTemplate.html(code);
    return { subject, html };
  }
}

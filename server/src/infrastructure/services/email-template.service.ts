import { IEmailTemplateService, EmailTemplate } from '../../../domain/interfaces/services/IEmailTemplateService';
import { otpVerificationTemplate } from '../messaging/templates/otp-verification.template';

/**
 * Email Template Service Implementation
 * Provides access to email templates
 */
export class EmailTemplateService implements IEmailTemplateService {
  getOtpVerificationTemplate(): EmailTemplate {
    return otpVerificationTemplate;
  }
}

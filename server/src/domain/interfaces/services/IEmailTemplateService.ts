export interface EmailTemplate {
  subject: string;
  html: (code: string) => string;
}

/**
 * Email Template Service Interface
 * Responsible for providing email templates
 */
export interface IEmailTemplateService {
  getOtpVerificationTemplate(): EmailTemplate;
}

import { IEmailTemplateService } from 'src/domain/interfaces/services/IEmailTemplateService';
import { priceChangeNotificationTemplate } from 'src/infrastructure/messaging/templates/price-change-notification.template';
import { otpVerificationTemplate } from 'src/infrastructure/messaging/templates/otp-verification.template';
import * as hiringTemplates from 'src/infrastructure/messaging/templates/hiring-process.templates';

export class EmailTemplateService implements IEmailTemplateService {

  getPriceChangeNotificationEmail(
    planName: string,
    oldPrice: number,
    newPrice: number,
    billingCycle: 'monthly' | 'yearly',
    periodEnd: Date | undefined,
    companyName?: string,
  ): { subject: string; html: string } {
    const subject = priceChangeNotificationTemplate.subject(planName);
    const html = priceChangeNotificationTemplate.html(planName, oldPrice, newPrice, billingCycle, periodEnd, companyName);
    return { subject, html };
  }

  getOtpVerificationEmail(code: string): { subject: string; html: string } {
    const subject = otpVerificationTemplate.subject;
    const html = otpVerificationTemplate.html(code);
    return { subject, html };
  }

  getApplicationReceivedEmail(candidateName: string, jobTitle: string, companyName: string): { subject: string; html: string } {
    const subject = hiringTemplates.applicationReceivedTemplate.subject(jobTitle);
    const html = hiringTemplates.applicationReceivedTemplate.html(candidateName, jobTitle, companyName);
    return { subject, html };
  }

  getStageChangeEmail(candidateName: string, jobTitle: string, companyName: string, stage: string): { subject: string; html: string } {
    const subject = hiringTemplates.stageChangedTemplate.subject(jobTitle, stage);
    const html = hiringTemplates.stageChangedTemplate.html(candidateName, jobTitle, companyName, stage);
    return { subject, html };
  }

  getInterviewScheduledEmail(candidateName: string, jobTitle: string, companyName: string, date: string, time: string, type: string): { subject: string; html: string } {
    const subject = hiringTemplates.interviewScheduledTemplate.subject(jobTitle);
    const html = hiringTemplates.interviewScheduledTemplate.html(candidateName, jobTitle, companyName, date, time, type);
    return { subject, html };
  }

  getTechnicalTaskAssignedEmail(candidateName: string, jobTitle: string, companyName: string, taskTitle: string, deadline: string): { subject: string; html: string } {
    const subject = hiringTemplates.technicalTaskAssignedTemplate.subject(jobTitle);
    const html = hiringTemplates.technicalTaskAssignedTemplate.html(candidateName, jobTitle, companyName, taskTitle, deadline);
    return { subject, html };
  }

  getCompensationInitiatedEmail(candidateName: string, jobTitle: string, companyName: string): { subject: string; html: string } {
    const subject = hiringTemplates.compensationInitiatedTemplate.subject(jobTitle);
    const html = hiringTemplates.compensationInitiatedTemplate.html(candidateName, jobTitle, companyName);
    return { subject, html };
  }

  getOfferExtendedEmail(candidateName: string, jobTitle: string, companyName: string): { subject: string; html: string } {
    const subject = hiringTemplates.offerExtendedTemplate.subject(jobTitle);
    const html = hiringTemplates.offerExtendedTemplate.html(candidateName, jobTitle, companyName);
    return { subject, html };
  }

  getOfferAcceptedEmail(candidateName: string, jobTitle: string, companyName: string): { subject: string; html: string } {
    const subject = hiringTemplates.offerAcceptedTemplate.subject(jobTitle);
    const html = hiringTemplates.offerAcceptedTemplate.html(candidateName, jobTitle, companyName);
    return { subject, html };
  }

  getRejectionEmail(candidateName: string, jobTitle: string, companyName: string): { subject: string; html: string } {
    const subject = hiringTemplates.rejectionTemplate.subject(jobTitle);
    const html = hiringTemplates.rejectionTemplate.html(candidateName, jobTitle, companyName);
    return { subject, html };
  }

  getJobClosedEmail(candidateName: string, jobTitle: string, companyName: string): { subject: string; html: string } {
    const subject = hiringTemplates.jobClosedTemplate.subject(jobTitle);
    const html = hiringTemplates.jobClosedTemplate.html(candidateName, jobTitle, companyName);
    return { subject, html };
  }
}

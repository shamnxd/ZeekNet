export interface IEmailTemplateService {
  getPriceChangeNotificationEmail(
    planName: string,
    oldPrice: number,
    newPrice: number,
    billingCycle: 'monthly' | 'yearly',
    periodEnd: Date | undefined,
    companyName?: string,
  ): { subject: string; html: string };

  getOtpVerificationEmail(code: string): { subject: string; html: string };

  getApplicationReceivedEmail(candidateName: string, jobTitle: string, companyName: string): { subject: string; html: string };
  getStageChangeEmail(candidateName: string, jobTitle: string, companyName: string, stage: string): { subject: string; html: string };
  getInterviewScheduledEmail(candidateName: string, jobTitle: string, companyName: string, date: string, time: string, type: string): { subject: string; html: string };
  getTechnicalTaskAssignedEmail(candidateName: string, jobTitle: string, companyName: string, taskTitle: string, deadline: string): { subject: string; html: string };
  getCompensationInitiatedEmail(candidateName: string, jobTitle: string, companyName: string): { subject: string; html: string };
  getOfferExtendedEmail(candidateName: string, jobTitle: string, companyName: string): { subject: string; html: string };
  getOfferAcceptedEmail(candidateName: string, jobTitle: string, companyName: string): { subject: string; html: string };
  getRejectionEmail(candidateName: string, jobTitle: string, companyName: string): { subject: string; html: string };
  getJobClosedEmail(candidateName: string, jobTitle: string, companyName: string): { subject: string; html: string };
}

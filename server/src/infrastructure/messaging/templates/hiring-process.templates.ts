
export const applicationReceivedTemplate = {
  subject: (jobTitle: string) => `Application Received - ${jobTitle}`,
  html: (candidateName: string, jobTitle: string, companyName: string) => `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Application Received</h2>
      <p>Hi ${candidateName},</p>
      <p>Thanks for applying to <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
      <p>We have received your application and will review it shortly.</p>
      <p>Best regards,<br/>The ${companyName} Team</p>
    </div>
  `,
};

export const stageChangedTemplate = {
  subject: (jobTitle: string, stage: string) => `Update on your application for ${jobTitle}`,
  html: (candidateName: string, jobTitle: string, companyName: string, stage: string) => `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Application Status Update</h2>
      <p>Hi ${candidateName},</p>
      <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has moved to the next stage: <strong>${stage}</strong>.</p>
      <p>We will be in touch soon with next steps.</p>
      <p>Best regards,<br/>The ${companyName} Team</p>
    </div>
  `,
};

export const interviewScheduledTemplate = {
  subject: (jobTitle: string) => `Interview Scheduled - ${jobTitle}`,
  html: (candidateName: string, jobTitle: string, companyName: string, date: string, time: string, type: string) => `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Interview Scheduled</h2>
      <p>Hi ${candidateName},</p>
      <p>An interview for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong> has been scheduled.</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
      <p><strong>Type:</strong> ${type}</p>
      <p>Please check your dashboard for more details and the meeting link.</p>
      <p>Best regards,<br/>The ${companyName} Team</p>
    </div>
  `,
};

export const technicalTaskAssignedTemplate = {
  subject: (jobTitle: string) => `Technical Task Assigned - ${jobTitle}`,
  html: (candidateName: string, jobTitle: string, companyName: string, taskTitle: string, deadline: string) => `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Technical Task Assigned</h2>
      <p>Hi ${candidateName},</p>
      <p>You have been assigned a technical task for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.</p>
      <p><strong>Task:</strong> ${taskTitle}</p>
      <p><strong>Deadline:</strong> ${deadline}</p>
      <p>Please log in to your dashboard to view the instructions and submit your work.</p>
      <p>Best regards,<br/>The ${companyName} Team</p>
    </div>
  `,
};

export const compensationInitiatedTemplate = {
  subject: (jobTitle: string) => `Compensation Discussion - ${jobTitle}`,
  html: (candidateName: string, jobTitle: string, companyName: string) => `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Compensation Phase</h2>
      <p>Hi ${candidateName},</p>
      <p>We are pleased to inform you that we are moving forward with the compensation discussion for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.</p>
      <p>Our team will reach out to you shortly to discuss the details.</p>
      <p>Best regards,<br/>The ${companyName} Team</p>
    </div>
  `,
};

export const offerExtendedTemplate = {
  subject: (jobTitle: string) => `Offer Letter - ${jobTitle}`,
  html: (candidateName: string, jobTitle: string, companyName: string) => `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Congratulations!</h2>
      <p>Hi ${candidateName},</p>
      <p>We are excited to offer you the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>!</p>
      <p>Your offer letter has been sent. Please check your dashboard to review and sign the offer.</p>
      <p>We look forward to having you on board.</p>
      <p>Best regards,<br/>The ${companyName} Team</p>
    </div>
  `,
};

export const offerAcceptedTemplate = {
  subject: (jobTitle: string) => `Offer Accepted - ${jobTitle}`,
  html: (candidateName: string, jobTitle: string, companyName: string) => `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Welcome to the Team!</h2>
      <p>Hi ${candidateName},</p>
      <p>We are thrilled that you have accepted our offer for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.</p>
      <p>We will be in touch with onboarding details soon.</p>
      <p>Welcome to ${companyName}!</p>
    </div>
  `,
};

export const rejectionTemplate = {
  subject: (jobTitle: string) => `Update on your application for ${jobTitle}`,
  html: (candidateName: string, jobTitle: string, companyName: string) => `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Application Status Update</h2>
      <p>Hi ${candidateName},</p>
      <p>Thank you for giving us the opportunity to review your application for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.</p>
      <p>After careful consideration, we have decided not to move forward with your application at this time.</p>
      <p>We appreciate your interest and wish you the best in your job search.</p>
      <p>Best regards,<br/>The ${companyName} Team</p>
    </div>
  `,
};

export const jobClosedTemplate = {
  subject: (jobTitle: string) => `Job Post Closed - ${jobTitle}`,
  html: (candidateName: string, jobTitle: string, companyName: string) => `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Job Position Closed</h2>
      <p>Hi ${candidateName},</p>
      <p>This email is to inform you that the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong> has been closed and we are no longer accepting applications.</p>
      <p>Thank you for your interest.</p>
      <p>Best regards,<br/>The ${companyName} Team</p>
    </div>
  `,
};

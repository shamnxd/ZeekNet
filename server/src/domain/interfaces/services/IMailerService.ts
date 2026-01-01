export interface IMailerService {
  sendMail(to: string, subject: string, html: string): Promise<void>;
}

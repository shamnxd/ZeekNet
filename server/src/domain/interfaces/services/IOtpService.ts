export interface IOtpService {
  generateOtp(email: string): Promise<string>;
  verifyOtp(email: string, code: string): Promise<boolean>;
  generateAndStoreOtp(email: string): Promise<string>;
}

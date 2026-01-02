export interface IPasswordResetService {
  generateResetToken(userId: string, email: string): Promise<string>;
  getResetToken(token: string): Promise<{ userId: string; email: string } | null>;
  invalidateToken(token: string): Promise<void>;
  sendResetEmail(email: string, token: string): Promise<void>;
}

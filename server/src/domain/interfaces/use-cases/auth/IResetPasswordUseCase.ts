
export interface IResetPasswordUseCase {
  execute(token: string, newPassword: string): Promise<void>;
}

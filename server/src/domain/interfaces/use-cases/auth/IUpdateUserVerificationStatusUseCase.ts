
export interface IUpdateUserVerificationStatusUseCase {
  execute(email: string, isVerified: boolean): Promise<void>;
}

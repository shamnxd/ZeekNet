
export interface ILogoutUseCase {
  execute(userId: string): Promise<void>;
}

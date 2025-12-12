
export interface IRemoveResumeUseCase {
  execute(userId: string): Promise<void>;
}

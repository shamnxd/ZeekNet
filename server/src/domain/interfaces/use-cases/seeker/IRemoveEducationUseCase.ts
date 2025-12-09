
export interface IRemoveEducationUseCase {
  execute(userId: string, educationId: string): Promise<void>;
}

export interface IAdminDeleteJobUseCase {
  execute(jobId: string): Promise<boolean>;
}

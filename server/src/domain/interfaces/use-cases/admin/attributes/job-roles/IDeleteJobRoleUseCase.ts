
export interface IDeleteJobRoleUseCase {
  execute(jobRoleId: string): Promise<boolean>;
}

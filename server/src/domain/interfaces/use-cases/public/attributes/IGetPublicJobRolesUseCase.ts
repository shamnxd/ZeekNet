
export interface IGetPublicJobRolesUseCase {
  execute(search?: string, limit?: number): Promise<string[]>;
}


export interface IGetCompanyIdByUserIdUseCase {
  execute(userId: string): Promise<string>;
}

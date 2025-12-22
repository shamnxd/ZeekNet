export interface IGetPublicCompanyProfileUseCase {
  execute(companyId: string): Promise<unknown>;
}

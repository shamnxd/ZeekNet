export interface IDeleteCompanyTechStackUseCase {
  execute(companyId: string, techStackId: string): Promise<void>;
}

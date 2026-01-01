
export interface IDeleteCompanyBenefitUseCase {
  execute(companyId: string, benefitId: string): Promise<void>;
}

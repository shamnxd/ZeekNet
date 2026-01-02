
export interface IDeleteCompanyOfficeLocationUseCase {
  execute(companyId: string, locationId: string): Promise<void>;
}

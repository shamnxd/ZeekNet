
export interface IDeleteCompanyTechStackUseCase {
  execute(techStackId: string): Promise<void>;
}

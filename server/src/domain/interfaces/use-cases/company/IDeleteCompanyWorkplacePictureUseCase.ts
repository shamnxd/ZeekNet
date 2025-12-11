export interface IDeleteCompanyWorkplacePictureUseCase {
  execute(companyId: string, pictureId: string): Promise<void>;
}

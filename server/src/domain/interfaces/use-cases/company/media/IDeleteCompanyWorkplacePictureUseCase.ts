export interface IDeleteCompanyWorkplacePictureUseCase {
  execute(data: { userId: string; pictureId: string }): Promise<void>;
}

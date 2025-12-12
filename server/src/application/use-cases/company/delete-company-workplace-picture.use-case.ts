import { ICompanyWorkplacePicturesRepository } from '../../../domain/interfaces/repositories/company/ICompanyWorkplacePicturesRepository';
import { NotFoundError, AuthorizationError } from '../../../domain/errors/errors';
import { IDeleteCompanyWorkplacePictureUseCase } from '../../../domain/interfaces/use-cases/company/IDeleteCompanyWorkplacePictureUseCase';

export class DeleteCompanyWorkplacePictureUseCase implements IDeleteCompanyWorkplacePictureUseCase {
  constructor(private readonly _companyWorkplacePicturesRepository: ICompanyWorkplacePicturesRepository) {}

  async execute(companyId: string, pictureId: string): Promise<void> {
    const existingPicture = await this._companyWorkplacePicturesRepository.findById(pictureId);
    if (!existingPicture) {
      throw new NotFoundError(`Company workplace picture with ID ${pictureId} not found`);
    }
    if (existingPicture.companyId !== companyId) {
      throw new AuthorizationError('Not authorized to delete this workplace picture');
    }
    await this._companyWorkplacePicturesRepository.delete(pictureId);
  }
}


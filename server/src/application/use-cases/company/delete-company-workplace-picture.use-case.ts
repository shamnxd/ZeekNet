import { ICompanyWorkplacePicturesRepository } from '../../../domain/interfaces/repositories/company/ICompanyWorkplacePicturesRepository';
import { NotFoundError } from '../../../domain/errors/errors';
import { IDeleteCompanyWorkplacePictureUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';

export class DeleteCompanyWorkplacePictureUseCase implements IDeleteCompanyWorkplacePictureUseCase {
  constructor(private readonly _companyWorkplacePicturesRepository: ICompanyWorkplacePicturesRepository) {}

  async execute(pictureId: string): Promise<void> {
    const deleted = await this._companyWorkplacePicturesRepository.delete(pictureId);
    if (!deleted) {
      throw new NotFoundError(`Company workplace picture with ID ${pictureId} not found`);
    }
  }
}


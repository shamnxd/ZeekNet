import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ICompanyWorkplacePicturesRepository } from 'src/domain/interfaces/repositories/company/ICompanyWorkplacePicturesRepository';
import { NotFoundError, AuthorizationError } from 'src/domain/errors/errors';
import { IDeleteCompanyWorkplacePictureUseCase } from 'src/domain/interfaces/use-cases/company/media/IDeleteCompanyWorkplacePictureUseCase';
import { IGetCompanyIdByUserIdUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyIdByUserIdUseCase';

@injectable()
export class DeleteCompanyWorkplacePictureUseCase implements IDeleteCompanyWorkplacePictureUseCase {
  constructor(
    @inject(TYPES.CompanyWorkplacePicturesRepository) private readonly _companyWorkplacePicturesRepository: ICompanyWorkplacePicturesRepository,
    @inject(TYPES.GetCompanyIdByUserIdUseCase) private readonly _getCompanyIdByUserIdUseCase: IGetCompanyIdByUserIdUseCase,
  ) {}

  async execute(data: { userId: string; pictureId: string }): Promise<void> {
    const companyId = await this._getCompanyIdByUserIdUseCase.execute(data.userId);
    const existingPicture = await this._companyWorkplacePicturesRepository.findById(data.pictureId);
    if (!existingPicture) {
      throw new NotFoundError(`Company workplace picture with ID ${data.pictureId} not found`);
    }
    if (existingPicture.companyId !== companyId) {
      throw new AuthorizationError('Not authorized to delete this workplace picture');
    }
    await this._companyWorkplacePicturesRepository.delete(data.pictureId);
  }
}


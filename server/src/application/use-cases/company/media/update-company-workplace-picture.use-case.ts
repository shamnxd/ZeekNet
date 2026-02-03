import { ICompanyWorkplacePicturesRepository } from 'src/domain/interfaces/repositories/company/ICompanyWorkplacePicturesRepository';
import { NotFoundError, AuthorizationError } from 'src/domain/errors/errors';
import { IUpdateCompanyWorkplacePictureUseCase } from 'src/domain/interfaces/use-cases/company/media/IUpdateCompanyWorkplacePictureUseCase';
import { IGetCompanyIdByUserIdUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyIdByUserIdUseCase';
import { CompanyWorkplacePictureResponseDto } from 'src/application/dtos/company/media/responses/company-workplace-picture-response.dto';
import { CompanyWorkplacePictureMapper } from 'src/application/mappers/company/media/company-workplace-picture.mapper';

export class UpdateCompanyWorkplacePictureUseCase implements IUpdateCompanyWorkplacePictureUseCase {
  constructor(
    private readonly _companyWorkplacePicturesRepository: ICompanyWorkplacePicturesRepository,
    private readonly _getCompanyIdByUserIdUseCase: IGetCompanyIdByUserIdUseCase,
  ) {}

  async execute(data: { userId: string; pictureId: string; pictureUrl: string; caption?: string }): Promise<CompanyWorkplacePictureResponseDto> {
    const companyId = await this._getCompanyIdByUserIdUseCase.execute(data.userId);
    const { userId, pictureId, ...updateData } = data;
    const existingPicture = await this._companyWorkplacePicturesRepository.findById(pictureId);
    if (!existingPicture) {
      throw new NotFoundError(`Company workplace picture with ID ${pictureId} not found`);
    }
    if (existingPicture.companyId !== companyId) {
      throw new AuthorizationError('Not authorized to update this workplace picture');
    }
    const updatedPicture = await this._companyWorkplacePicturesRepository.update(pictureId, updateData);
    if (!updatedPicture) {
      throw new NotFoundError(`Failed to update company workplace picture with ID ${pictureId}`);
    }
    return CompanyWorkplacePictureMapper.toResponse(updatedPicture);
  }
}



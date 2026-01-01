import { ICompanyWorkplacePicturesRepository } from '../../../domain/interfaces/repositories/company/ICompanyWorkplacePicturesRepository';
import { CompanyWorkplacePictures } from '../../../domain/entities/company-workplace-pictures.entity';
import { UpdateCompanyWorkplacePicturesRequestDto } from '../../dtos/company/common/company-workplace-pictures.dto';
import { NotFoundError, AuthorizationError } from '../../../domain/errors/errors';
import { IUpdateCompanyWorkplacePictureUseCase } from '../../../domain/interfaces/use-cases/company/IUpdateCompanyWorkplacePictureUseCase';

export class UpdateCompanyWorkplacePictureUseCase implements IUpdateCompanyWorkplacePictureUseCase {
  constructor(private readonly _companyWorkplacePicturesRepository: ICompanyWorkplacePicturesRepository) {}

  async execute(companyId: string, pictureId: string, data: UpdateCompanyWorkplacePicturesRequestDto): Promise<CompanyWorkplacePictures> {
    const existingPicture = await this._companyWorkplacePicturesRepository.findById(pictureId);
    if (!existingPicture) {
      throw new NotFoundError(`Company workplace picture with ID ${pictureId} not found`);
    }
    if (existingPicture.companyId !== companyId) {
      throw new AuthorizationError('Not authorized to update this workplace picture');
    }
    const updatedPicture = await this._companyWorkplacePicturesRepository.update(pictureId, data);
    if (!updatedPicture) {
      throw new NotFoundError(`Failed to update company workplace picture with ID ${pictureId}`);
    }
    return updatedPicture;
  }
}



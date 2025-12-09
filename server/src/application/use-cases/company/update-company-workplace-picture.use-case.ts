import { ICompanyWorkplacePicturesRepository } from '../../../domain/interfaces/repositories/company/ICompanyWorkplacePicturesRepository';
import { CompanyWorkplacePictures } from '../../../domain/entities/company-workplace-pictures.entity';
import { UpdateCompanyWorkplacePicturesRequestDto } from '../../dto/company/company-workplace-pictures.dto';
import { NotFoundError } from '../../../domain/errors/errors';
import { IUpdateCompanyWorkplacePictureUseCase } from '../../../domain/interfaces/use-cases/company/IUpdateCompanyWorkplacePictureUseCase';

export class UpdateCompanyWorkplacePictureUseCase implements IUpdateCompanyWorkplacePictureUseCase {
  constructor(private readonly _companyWorkplacePicturesRepository: ICompanyWorkplacePicturesRepository) {}

  async execute(pictureId: string, data: UpdateCompanyWorkplacePicturesRequestDto): Promise<CompanyWorkplacePictures> {
    const updatedPicture = await this._companyWorkplacePicturesRepository.update(pictureId, data);
    if (!updatedPicture) {
      throw new NotFoundError(`Company workplace picture with ID ${pictureId} not found`);
    }
    return updatedPicture;
  }
}


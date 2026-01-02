import { ICompanyWorkplacePicturesRepository } from 'src/domain/interfaces/repositories/company/ICompanyWorkplacePicturesRepository';
import { CompanyWorkplacePictures } from 'src/domain/entities/company-workplace-pictures.entity';
import { CreateCompanyWorkplacePicturesRequestDto } from 'src/application/dtos/company/media/requests/company-workplace-pictures.dto';
import { ICreateCompanyWorkplacePictureUseCase } from 'src/domain/interfaces/use-cases/company/media/ICreateCompanyWorkplacePictureUseCase';

export class CreateCompanyWorkplacePictureUseCase implements ICreateCompanyWorkplacePictureUseCase {
  constructor(private readonly _companyWorkplacePicturesRepository: ICompanyWorkplacePicturesRepository) {}

  async execute(data: CreateCompanyWorkplacePicturesRequestDto): Promise<CompanyWorkplacePictures> {
    const { companyId } = data;
    if (!companyId) {
      throw new Error('Company ID is required');
    }
    const picture = CompanyWorkplacePictures.create({ ...data, companyId });
    return this._companyWorkplacePicturesRepository.create(picture);
  }
}



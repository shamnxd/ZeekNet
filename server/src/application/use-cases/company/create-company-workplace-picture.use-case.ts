import { ICompanyWorkplacePicturesRepository } from '../../../domain/interfaces/repositories/company/ICompanyWorkplacePicturesRepository';
import { CompanyWorkplacePictures } from '../../../domain/entities/company-workplace-pictures.entity';
import { CreateCompanyWorkplacePicturesRequestDto } from '../../dto/company/company-workplace-pictures.dto';
import { ICreateCompanyWorkplacePictureUseCase } from 'src/domain/interfaces/use-cases/company/ICreateCompanyWorkplacePictureUseCase';

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


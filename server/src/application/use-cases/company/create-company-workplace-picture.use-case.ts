import { ICompanyWorkplacePicturesRepository } from '../../../domain/interfaces/repositories/company/ICompanyWorkplacePicturesRepository';
import { CompanyWorkplacePictures } from '../../../domain/entities/company-workplace-pictures.entity';
import { CreateCompanyWorkplacePicturesRequestDto } from '../../dto/company/company-workplace-pictures.dto';
import { ICreateCompanyWorkplacePictureUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';

export class CreateCompanyWorkplacePictureUseCase implements ICreateCompanyWorkplacePictureUseCase {
  constructor(private readonly _companyWorkplacePicturesRepository: ICompanyWorkplacePicturesRepository) {}

  async execute(companyId: string, data: CreateCompanyWorkplacePicturesRequestDto): Promise<CompanyWorkplacePictures> {
    const picture = CompanyWorkplacePictures.create({ ...data, companyId });
    return this._companyWorkplacePicturesRepository.create(picture);
  }
}


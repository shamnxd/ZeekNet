import { ICompanyWorkplacePicturesRepository } from 'src/domain/interfaces/repositories/company/ICompanyWorkplacePicturesRepository';
import { CompanyWorkplacePictures } from 'src/domain/entities/company-workplace-pictures.entity';
import { IGetCompanyWorkplacePictureUseCase } from 'src/domain/interfaces/use-cases/company/media/IGetCompanyWorkplacePictureUseCase';

export class GetCompanyWorkplacePictureUseCase implements IGetCompanyWorkplacePictureUseCase {
  constructor(private readonly _companyWorkplacePicturesRepository: ICompanyWorkplacePicturesRepository) {}

  async execute(companyId: string): Promise<CompanyWorkplacePictures[]> {
    return this._companyWorkplacePicturesRepository.findMany({ companyId });
  }
}


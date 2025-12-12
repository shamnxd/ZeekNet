import { ICompanyWorkplacePicturesRepository } from '../../../domain/interfaces/repositories/company/ICompanyWorkplacePicturesRepository';
import { CompanyWorkplacePictures } from '../../../domain/entities/company-workplace-pictures.entity';
import { IGetCompanyWorkplacePictureUseCase } from '../../../domain/interfaces/use-cases/company/IGetCompanyWorkplacePictureUseCase';

export class GetCompanyWorkplacePictureUseCase implements IGetCompanyWorkplacePictureUseCase {
  constructor(private readonly _companyWorkplacePicturesRepository: ICompanyWorkplacePicturesRepository) {}

  async execute(companyId: string): Promise<CompanyWorkplacePictures[]> {
    return this._companyWorkplacePicturesRepository.findMany({ companyId });
  }
}


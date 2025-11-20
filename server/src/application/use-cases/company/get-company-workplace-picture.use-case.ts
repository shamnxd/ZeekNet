import { ICompanyWorkplacePicturesRepository } from '../../../domain/interfaces/repositories/company/ICompanyWorkplacePicturesRepository';
import { CompanyWorkplacePictures } from '../../../domain/entities/company-workplace-pictures.entity';
import { IGetCompanyWorkplacePictureUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';

export class GetCompanyWorkplacePictureUseCase implements IGetCompanyWorkplacePictureUseCase {
  constructor(private readonly _companyWorkplacePicturesRepository: ICompanyWorkplacePicturesRepository) {}

  async executeByCompanyId(companyId: string): Promise<CompanyWorkplacePictures[]> {
    return this._companyWorkplacePicturesRepository.findMany({ companyId });
  }

  async executeById(pictureId: string): Promise<CompanyWorkplacePictures | null> {
    return this._companyWorkplacePicturesRepository.findById(pictureId);
  }
}


import { CompanyWorkplacePictures } from 'src/domain/entities/company-workplace-pictures.entity';

// be

export interface IGetCompanyWorkplacePictureUseCase {
  executeByCompanyId(companyId: string): Promise<CompanyWorkplacePictures[]>;
  executeById(pictureId: string): Promise<CompanyWorkplacePictures | null>;
}

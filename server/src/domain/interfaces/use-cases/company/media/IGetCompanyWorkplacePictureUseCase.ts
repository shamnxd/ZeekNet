import { CompanyWorkplacePictures } from 'src/domain/entities/company-workplace-pictures.entity';

export interface IGetCompanyWorkplacePictureUseCase {
  execute(companyId: string): Promise<CompanyWorkplacePictures[]>;
}

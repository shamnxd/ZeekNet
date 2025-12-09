import { CompanyWorkplacePictures } from 'src/domain/entities/company-workplace-pictures.entity';
import { CompanyWorkplacePicturesData } from './CompanyWorkplacePicturesData';

// be

export interface ICreateCompanyWorkplacePictureUseCase {
  execute(companyId: string, data: CompanyWorkplacePicturesData): Promise<CompanyWorkplacePictures>;
}

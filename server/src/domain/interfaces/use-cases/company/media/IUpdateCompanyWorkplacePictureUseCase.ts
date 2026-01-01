import { CompanyWorkplacePictures } from 'src/domain/entities/company-workplace-pictures.entity';
import { UpdateCompanyWorkplacePicturesRequestDto } from 'src/application/dtos/company/media/requests/company-workplace-pictures.dto';

export interface IUpdateCompanyWorkplacePictureUseCase {
  execute(companyId: string, pictureId: string, data: UpdateCompanyWorkplacePicturesRequestDto): Promise<CompanyWorkplacePictures>;
}


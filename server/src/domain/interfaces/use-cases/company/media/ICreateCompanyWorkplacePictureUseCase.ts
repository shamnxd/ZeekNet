import { CompanyWorkplacePictures } from 'src/domain/entities/company-workplace-pictures.entity';
import { CreateCompanyWorkplacePicturesRequestDto } from 'src/application/dtos/company/media/requests/company-workplace-pictures.dto';

export interface ICreateCompanyWorkplacePictureUseCase {
  execute(data: CreateCompanyWorkplacePicturesRequestDto): Promise<CompanyWorkplacePictures>;
}


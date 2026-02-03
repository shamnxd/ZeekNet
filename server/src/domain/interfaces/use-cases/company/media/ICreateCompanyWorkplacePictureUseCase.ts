import { CompanyWorkplacePictureResponseDto } from 'src/application/dtos/company/media/responses/company-workplace-picture-response.dto';

export interface ICreateCompanyWorkplacePictureUseCase {
  execute(data: {
    userId: string;
    pictureUrl: string;
    caption?: string;
  }): Promise<CompanyWorkplacePictureResponseDto>;
}


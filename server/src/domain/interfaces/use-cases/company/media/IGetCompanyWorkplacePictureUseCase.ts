import { CompanyWorkplacePictureResponseDto } from 'src/application/dtos/company/media/responses/company-workplace-picture-response.dto';

export interface IGetCompanyWorkplacePictureUseCase {
  execute(data: { userId: string }): Promise<CompanyWorkplacePictureResponseDto[]>;
}

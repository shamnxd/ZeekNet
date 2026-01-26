import { ICompanyWorkplacePicturesRepository } from 'src/domain/interfaces/repositories/company/ICompanyWorkplacePicturesRepository';
import { CompanyWorkplacePictures } from 'src/domain/entities/company-workplace-pictures.entity';
import { ICreateCompanyWorkplacePictureUseCase } from 'src/domain/interfaces/use-cases/company/media/ICreateCompanyWorkplacePictureUseCase';
import { IGetCompanyIdByUserIdUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyIdByUserIdUseCase';
import { CompanyWorkplacePictureResponseDto } from 'src/application/dtos/company/media/responses/company-workplace-picture-response.dto';
import { CompanyWorkplacePictureMapper } from 'src/application/mappers/company/media/company-workplace-picture.mapper';

export class CreateCompanyWorkplacePictureUseCase implements ICreateCompanyWorkplacePictureUseCase {
  constructor(
    private readonly _companyWorkplacePicturesRepository: ICompanyWorkplacePicturesRepository,
    private readonly _getCompanyIdByUserIdUseCase: IGetCompanyIdByUserIdUseCase,
  ) {}

  async execute(data: { userId: string; pictureUrl: string; caption?: string }): Promise<CompanyWorkplacePictureResponseDto> {
    const companyId = await this._getCompanyIdByUserIdUseCase.execute(data.userId);
    const { userId, ...pictureData } = data;
    const picture = CompanyWorkplacePictures.create({ ...pictureData, companyId });
    const createdPicture = await this._companyWorkplacePicturesRepository.create(picture);
    return CompanyWorkplacePictureMapper.toResponse(createdPicture);
  }
}



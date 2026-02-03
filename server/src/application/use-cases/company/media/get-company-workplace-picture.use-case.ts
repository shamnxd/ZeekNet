import { ICompanyWorkplacePicturesRepository } from 'src/domain/interfaces/repositories/company/ICompanyWorkplacePicturesRepository';
import { IGetCompanyWorkplacePictureUseCase } from 'src/domain/interfaces/use-cases/company/media/IGetCompanyWorkplacePictureUseCase';
import { IGetCompanyIdByUserIdUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyIdByUserIdUseCase';
import { CompanyWorkplacePictureResponseDto } from 'src/application/dtos/company/media/responses/company-workplace-picture-response.dto';
import { CompanyWorkplacePictureMapper } from 'src/application/mappers/company/media/company-workplace-picture.mapper';

export class GetCompanyWorkplacePictureUseCase implements IGetCompanyWorkplacePictureUseCase {
  constructor(
    private readonly _companyWorkplacePicturesRepository: ICompanyWorkplacePicturesRepository,
    private readonly _getCompanyIdByUserIdUseCase: IGetCompanyIdByUserIdUseCase,
  ) {}

  async execute(data: { userId: string }): Promise<CompanyWorkplacePictureResponseDto[]> {
    const companyId = await this._getCompanyIdByUserIdUseCase.execute(data.userId);
    const pictures = await this._companyWorkplacePicturesRepository.findMany({ companyId });
    return CompanyWorkplacePictureMapper.toResponseList(pictures);
  }
}


import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { IGetCompanyProfileUseCase } from 'src/domain/interfaces/use-cases/company/profile/info/IGetCompanyProfileUseCase';
import { IGetCompanyIdByUserIdUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyIdByUserIdUseCase';
import { NotFoundError } from 'src/domain/errors/errors';
import { ERROR } from 'src/shared/constants/messages';


@injectable()
export class GetCompanyIdByUserIdUseCase implements IGetCompanyIdByUserIdUseCase {
  constructor(
    @inject(TYPES.GetCompanyProfileUseCase) private readonly _getCompanyProfileUseCase: IGetCompanyProfileUseCase,
  ) {}

  async execute(userId: string): Promise<string> {
    const companyProfile = await this._getCompanyProfileUseCase.execute(userId);
    
    if (!companyProfile) {
      throw new NotFoundError(ERROR.NOT_FOUND('Company profile'));
    }

    return companyProfile.profile.id;
  }
}

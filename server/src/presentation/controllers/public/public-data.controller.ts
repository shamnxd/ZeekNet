import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from 'src/shared/constants/types';
import { GetSeekerCompaniesDtoSchema } from 'src/application/dtos/public/requests/get-seeker-companies.dto';
import { IGetPublicJobRolesUseCase } from 'src/domain/interfaces/use-cases/public/attributes/IGetPublicJobRolesUseCase';
import { IGetPublicJobCategoriesUseCase } from 'src/domain/interfaces/use-cases/public/attributes/IGetPublicJobCategoriesUseCase';
import { IGetPublicSkillsUseCase } from 'src/domain/interfaces/use-cases/public/attributes/IGetPublicSkillsUseCase';
import { IGetSeekerCompaniesUseCase } from 'src/domain/interfaces/use-cases/public/listings/companys/IGetSeekerCompaniesUseCase';
import { IGetPublicCompanyProfileUseCase } from 'src/domain/interfaces/use-cases/public/listings/companys/IGetPublicCompanyProfileUseCase';
import { formatZodErrors, handleAsyncError, handleValidationError, sendSuccessResponse } from 'src/shared/utils';
import { SUCCESS } from 'src/shared/constants/messages';

@injectable()
export class PublicDataController {
  constructor(
    @inject(TYPES.GetPublicSkillsUseCase) private readonly _getPublicSkillsUseCase: IGetPublicSkillsUseCase,
    @inject(TYPES.GetPublicJobCategoriesUseCase) private readonly _getPublicJobCategoriesUseCase: IGetPublicJobCategoriesUseCase,
    @inject(TYPES.GetPublicJobRolesUseCase) private readonly _getPublicJobRolesUseCase: IGetPublicJobRolesUseCase,
    @inject(TYPES.GetSeekerCompaniesUseCase) private readonly _getSeekerCompaniesUseCase: IGetSeekerCompaniesUseCase,
    @inject(TYPES.GetPublicCompanyProfileUseCase) private readonly _getPublicCompanyProfileUseCase: IGetPublicCompanyProfileUseCase,
  ) { }

  getAllSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const skills = await this._getPublicSkillsUseCase.execute();
      sendSuccessResponse(res, SUCCESS.RETRIEVED('Skills'), skills);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getAllJobCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await this._getPublicJobCategoriesUseCase.execute();
      sendSuccessResponse(res, SUCCESS.RETRIEVED('Job categories'), categories);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getAllJobRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const search = (req.query.search as string) || '';
      const limit = parseInt(req.query.limit as string) || 1000;
      const jobRoles = await this._getPublicJobRolesUseCase.execute(search, limit);
      sendSuccessResponse(res, SUCCESS.RETRIEVED('Job roles'), jobRoles);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getAllCompanies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = GetSeekerCompaniesDtoSchema.safeParse(req.query);
      if (!parsed.success) {
        return handleValidationError(formatZodErrors(parsed.error), next);
      }

      const result = await this._getSeekerCompaniesUseCase.execute(parsed.data);

      sendSuccessResponse(res, SUCCESS.RETRIEVED('Companies'), result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getCompanyProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this._getPublicCompanyProfileUseCase.execute(id);
      sendSuccessResponse(res, SUCCESS.RETRIEVED('Company profile'), result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}


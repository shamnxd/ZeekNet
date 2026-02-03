import { Request, Response, NextFunction } from 'express';
import { GetSeekerCompaniesDtoSchema } from 'src/application/dtos/public/requests/get-seeker-companies.dto';
import { handleValidationError } from 'src/shared/utils/presentation/controller.utils';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';
import { IGetPublicJobRolesUseCase } from 'src/domain/interfaces/use-cases/public/attributes/IGetPublicJobRolesUseCase';
import { IGetPublicJobCategoriesUseCase } from 'src/domain/interfaces/use-cases/public/attributes/IGetPublicJobCategoriesUseCase';
import { IGetPublicSkillsUseCase } from 'src/domain/interfaces/use-cases/public/attributes/IGetPublicSkillsUseCase';
import { IGetSeekerCompaniesUseCase } from 'src/domain/interfaces/use-cases/public/listings/companys/IGetSeekerCompaniesUseCase';
import { IGetPublicCompanyProfileUseCase } from 'src/domain/interfaces/use-cases/public/listings/companys/IGetPublicCompanyProfileUseCase';
import { handleAsyncError, sendSuccessResponse } from 'src/shared/utils/presentation/controller.utils';

export class PublicDataController {
  constructor(
    private readonly _getPublicSkillsUseCase: IGetPublicSkillsUseCase,
    private readonly _getPublicJobCategoriesUseCase: IGetPublicJobCategoriesUseCase,
    private readonly _getPublicJobRolesUseCase: IGetPublicJobRolesUseCase,
    private readonly _getSeekerCompaniesUseCase: IGetSeekerCompaniesUseCase,
    private readonly _getPublicCompanyProfileUseCase: IGetPublicCompanyProfileUseCase,
  ) { }



  getAllSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const skills = await this._getPublicSkillsUseCase.execute();
      sendSuccessResponse(res, 'Skills retrieved successfully', skills);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getAllJobCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await this._getPublicJobCategoriesUseCase.execute();
      sendSuccessResponse(res, 'Job categories retrieved successfully', categories);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getAllJobRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const search = (req.query.search as string) || '';
      const limit = parseInt(req.query.limit as string) || 1000;
      const jobRoles = await this._getPublicJobRolesUseCase.execute(search, limit);
      sendSuccessResponse(res, 'Job roles retrieved successfully', jobRoles);
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

      sendSuccessResponse(res, 'Companies retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getCompanyProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this._getPublicCompanyProfileUseCase.execute(id);
      sendSuccessResponse(res, 'Company profile retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}

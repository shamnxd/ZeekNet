import { Request, Response, NextFunction } from 'express';
import { IGetPublicJobRolesUseCase } from 'src/domain/interfaces/use-cases/public/attributes/IGetPublicJobRolesUseCase';
import { IGetPublicJobCategoriesUseCase } from 'src/domain/interfaces/use-cases/public/attributes/IGetPublicJobCategoriesUseCase';
import { IGetPublicSkillsUseCase } from 'src/domain/interfaces/use-cases/public/attributes/IGetPublicSkillsUseCase';
import { IGetSeekerCompaniesUseCase } from 'src/domain/interfaces/use-cases/public/listings/companys/IGetSeekerCompaniesUseCase';
import { IGetPublicCompanyProfileUseCase } from 'src/domain/interfaces/use-cases/public/listings/companys/IGetPublicCompanyProfileUseCase';
import { IGetPublicCompanyJobsUseCase } from 'src/presentation/interfaces/IGetPublicCompanyJobsUseCase';
import { handleAsyncError, sendSuccessResponse } from 'src/shared/utils/presentation/controller.utils';

export class PublicDataController {
  constructor(
    private readonly _getPublicSkillsUseCase: IGetPublicSkillsUseCase,
    private readonly _getPublicJobCategoriesUseCase: IGetPublicJobCategoriesUseCase,
    private readonly _getPublicJobRolesUseCase: IGetPublicJobRolesUseCase,
    private readonly _getSeekerCompaniesUseCase: IGetSeekerCompaniesUseCase,
    private readonly _getPublicCompanyProfileUseCase: IGetPublicCompanyProfileUseCase,
    private readonly _getPublicCompanyJobsUseCase: IGetPublicCompanyJobsUseCase,
  ) {}



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
      const jobRoles = await this._getPublicJobRolesUseCase.execute();
      sendSuccessResponse(res, 'Job roles retrieved successfully', jobRoles);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getAllCompanies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit, search, industry } = req.query;
      
      const result = await this._getSeekerCompaniesUseCase.execute({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        search: search as string,
        industry: industry as string,
      });
      
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

  getCompanyJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { page, limit } = req.query;
      
      const result = await this._getPublicCompanyJobsUseCase.execute(
        id,
        page ? parseInt(page as string) : 1,
        limit ? parseInt(limit as string) : 5,
      );
      
      sendSuccessResponse(res, 'Company jobs retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}



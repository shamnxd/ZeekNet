import { Request, Response, NextFunction } from 'express';
import { 
  IGetPublicSkillsUseCase, 
  IGetPublicJobCategoriesUseCase, 
  IGetPublicJobRolesUseCase, 
} from '../../../domain/interfaces/use-cases/IPublicUseCases';
import { handleAsyncError, sendSuccessResponse } from '../../../shared/utils/controller.utils';

export class PublicDataController {
  constructor(
    private readonly _getPublicSkillsUseCase: IGetPublicSkillsUseCase,
    private readonly _getPublicJobCategoriesUseCase: IGetPublicJobCategoriesUseCase,
    private readonly _getPublicJobRolesUseCase: IGetPublicJobRolesUseCase,
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
}


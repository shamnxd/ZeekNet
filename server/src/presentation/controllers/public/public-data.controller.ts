import { Request, Response, NextFunction } from 'express';
import { IGetAllSkillsUseCase } from '../../../domain/interfaces/use-cases/IAdminUseCases';
import { IGetAllJobCategoriesUseCase } from '../../../domain/interfaces/use-cases/IJobCategoryUseCases';
import { IGetAllJobRolesUseCase } from '../../../domain/interfaces/use-cases/IAdminUseCases';
import { handleError, success, handleValidationError, handleAsyncError, sendSuccessResponse } from '../../../shared/utils/controller.utils';
import { GetAllSkillsDto } from '../../../application/dto/admin/skill-management.dto';
import { GetAllJobRolesDto } from '../../../application/dto/admin/job-role-management.dto';

export class PublicDataController {
  constructor(
    private readonly _getAllSkillsUseCase: IGetAllSkillsUseCase,
    private readonly _getAllJobCategoriesUseCase: IGetAllJobCategoriesUseCase,
    private readonly _getAllJobRolesUseCase: IGetAllJobRolesUseCase,
  ) {}

  getAllSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const query = GetAllSkillsDto.safeParse(req.query);
    if (!query.success) {
      return handleValidationError(`Invalid query parameters: ${query.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`, next);
    }

    try {
      const skillNames = await this._getAllSkillsUseCase.execute(query.data);
      sendSuccessResponse(res, 'Skills retrieved successfully', skillNames);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getAllJobCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as unknown as { page?: number; limit?: number; search?: string };
      const categoryNames = await this._getAllJobCategoriesUseCase.execute(query);
      sendSuccessResponse(res, 'Job categories retrieved successfully', categoryNames);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getAllJobRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const query = GetAllJobRolesDto.safeParse(req.query);
    if (!query.success) {
      return handleValidationError(`Invalid query parameters: ${query.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`, next);
    }

    try {
      const jobRoleNames = await this._getAllJobRolesUseCase.execute(query.data);
      sendSuccessResponse(res, 'Job roles retrieved successfully', jobRoleNames);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}


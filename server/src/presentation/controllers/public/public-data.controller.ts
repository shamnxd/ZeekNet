import { Request, Response } from 'express';
import { IGetAllSkillsUseCase } from '../../../domain/interfaces/use-cases/IAdminUseCases';
import { IGetAllJobCategoriesUseCase } from '../../../domain/interfaces/use-cases/IJobCategoryUseCases';
import { IGetAllJobRolesUseCase } from '../../../domain/interfaces/use-cases/IAdminUseCases';
import { handleError } from '../../../shared/utils/controller.utils';
import { success } from '../../../shared/utils/controller.utils';
import { GetAllSkillsDto } from '../../../application/dto/admin/skill-management.dto';
import { GetAllJobRolesDto } from '../../../application/dto/admin/job-role-management.dto';

export class PublicDataController {
  constructor(
    private readonly _getAllSkillsUseCase: IGetAllSkillsUseCase,
    private readonly _getAllJobCategoriesUseCase: IGetAllJobCategoriesUseCase,
    private readonly _getAllJobRolesUseCase: IGetAllJobRolesUseCase,
  ) {}

  getAllSkills = async (req: Request, res: Response): Promise<void> => {
    try {
      const query = GetAllSkillsDto.safeParse(req.query);
      if (!query.success) {
        return handleError(res, new Error(`Invalid query parameters: ${query.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
      }

      const result = await this._getAllSkillsUseCase.execute(query.data);
      const skillNames = result.data.map((skill) => skill.name);
      success(res, skillNames, 'Skills retrieved successfully');
    } catch (error) {
      handleError(res, error);
    }
  };

  getAllJobCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const query = req.query as unknown as { page?: number; limit?: number; search?: string };
      const result = await this._getAllJobCategoriesUseCase.execute(query);
      const categoryNames = result.data.map((category) => category.name);
      success(res, categoryNames, 'Job categories retrieved successfully');
    } catch (error) {
      handleError(res, error);
    }
  };

  getAllJobRoles = async (req: Request, res: Response): Promise<void> => {
    try {
      const query = GetAllJobRolesDto.safeParse(req.query);
      if (!query.success) {
        return handleError(res, new Error(`Invalid query parameters: ${query.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
      }

      const result = await this._getAllJobRolesUseCase.execute(query.data);
      const jobRoleNames = result.data.map((role) => role.name);
      success(res, jobRoleNames, 'Job roles retrieved successfully');
    } catch (error) {
      handleError(res, error);
    }
  };
}


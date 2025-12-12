import { Request, Response, NextFunction } from 'express';
import { CreateSkillDto, UpdateSkillDto, GetAllSkillsDto } from '../../../application/dto/admin/skill-management.dto';
import { IDeleteSkillUseCase } from 'src/domain/interfaces/use-cases/skills/IDeleteSkillUseCase';
import { IUpdateSkillUseCase } from 'src/domain/interfaces/use-cases/skills/IUpdateSkillUseCase';
import { IGetSkillByIdUseCase } from 'src/domain/interfaces/use-cases/skills/IGetSkillByIdUseCase';
import { ICreateSkillUseCase } from 'src/domain/interfaces/use-cases/skills/ICreateSkillUseCase';
import { handleValidationError, handleAsyncError, sendSuccessResponse } from '../../../shared/utils/controller.utils';
import { IGetAllSkillsUseCase } from 'src/domain/interfaces/use-cases/skills/IGetAllSkillsUseCase';

export class AdminSkillController {
  constructor(
    private readonly _createSkillUseCase: ICreateSkillUseCase,
    private readonly _getAllSkillsUseCase: IGetAllSkillsUseCase,
    private readonly _getSkillByIdUseCase: IGetSkillByIdUseCase,
    private readonly _updateSkillUseCase: IUpdateSkillUseCase,
    private readonly _deleteSkillUseCase: IDeleteSkillUseCase,
  ) {}

  createSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = CreateSkillDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(
        `Invalid skill data: ${parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
        next,
      );
    }

    try {
      const skill = await this._createSkillUseCase.execute(parsed.data.name);
      sendSuccessResponse(res, 'Skill created successfully', skill);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getAllSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = GetAllSkillsDto.safeParse(req.query);
      if (!query.success) {
        return handleValidationError(
          `Invalid query parameters: ${query.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
          next,
        );
      }

      const result = await this._getAllSkillsUseCase.execute(query.data);
      sendSuccessResponse(res, 'Skills retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getSkillById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      return handleValidationError('Skill ID is required', next);
    }

    try {
      const skill = await this._getSkillByIdUseCase.execute(id);
      sendSuccessResponse(res, 'Skill retrieved successfully', skill);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      return handleValidationError('Skill ID is required', next);
    }

    const parsed = UpdateSkillDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(
        `Invalid skill data: ${parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
        next,
      );
    }

    try {
      const skill = await this._updateSkillUseCase.execute(id, parsed.data.name);
      sendSuccessResponse(res, 'Skill updated successfully', skill);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      return handleValidationError('Skill ID is required', next);
    }

    try {
      await this._deleteSkillUseCase.execute(id);
      sendSuccessResponse(res, 'Skill deleted successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
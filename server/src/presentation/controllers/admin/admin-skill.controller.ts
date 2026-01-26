import { NextFunction, Request, Response } from 'express';
import { ICreateSkillUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/skills/ICreateSkillUseCase';
import { IDeleteSkillUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/skills/IDeleteSkillUseCase';
import { IGetAllSkillsUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/skills/IGetAllSkillsUseCase';
import { IGetSkillByIdUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/skills/IGetSkillByIdUseCase';
import { IUpdateSkillUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/skills/IUpdateSkillUseCase';
import { CreateSkillDto } from 'src/application/dtos/admin/attributes/skills/requests/create-skill-request.dto';
import { GetAllSkillsDto } from 'src/application/dtos/admin/attributes/skills/requests/get-all-skills-query.dto';
import { UpdateSkillDto } from 'src/application/dtos/admin/attributes/skills/requests/update-skill-request.dto';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';
import { handleAsyncError, handleValidationError, sendSuccessResponse } from 'src/shared/utils/presentation/controller.utils';

export class AdminSkillController {
  constructor(
    private readonly _createSkillUseCase: ICreateSkillUseCase,
    private readonly _getAllSkillsUseCase: IGetAllSkillsUseCase,
    private readonly _getSkillByIdUseCase: IGetSkillByIdUseCase,
    private readonly _updateSkillUseCase: IUpdateSkillUseCase,
    private readonly _deleteSkillUseCase: IDeleteSkillUseCase,
  ) { }

  createSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = CreateSkillDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const skill = await this._createSkillUseCase.execute(parsed.data);
      sendSuccessResponse(res, 'Skill created successfully', skill);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getAllSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = GetAllSkillsDto.safeParse(req.query);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._getAllSkillsUseCase.execute(parsed.data);
      sendSuccessResponse(res, 'Skills retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getSkillById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const skill = await this._getSkillByIdUseCase.execute(id);
      sendSuccessResponse(res, 'Skill retrieved successfully', skill);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsedBody = UpdateSkillDto.safeParse(req.body);
    if (!parsedBody.success) {
      return handleValidationError(formatZodErrors(parsedBody.error), next);
    }

    try {
      const { id } = req.params;
      const skill = await this._updateSkillUseCase.execute(id, parsedBody.data);
      sendSuccessResponse(res, 'Skill updated successfully', skill);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this._deleteSkillUseCase.execute(id);
      sendSuccessResponse(res, 'Skill deleted successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}

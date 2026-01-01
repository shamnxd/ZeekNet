import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import {
  handleValidationError,
  handleAsyncError,
  sendSuccessResponse,
  validateUserId,
  sendNotFoundResponse,
} from 'src/shared/utils/presentation/controller.utils';
import { ICreateCompanyTechStackUseCase } from 'src/domain/interfaces/use-cases/company/profile/stack/ICreateCompanyTechStackUseCase';
import { IUpdateCompanyTechStackUseCase } from 'src/domain/interfaces/use-cases/company/profile/stack/IUpdateCompanyTechStackUseCase';
import { IDeleteCompanyTechStackUseCase } from 'src/domain/interfaces/use-cases/company/profile/stack/IDeleteCompanyTechStackUseCase';
import { IGetCompanyTechStackUseCase } from 'src/domain/interfaces/use-cases/company/profile/stack/IGetCompanyTechStackUseCase';
import { CreateCompanyTechStackDto, UpdateCompanyTechStackDto } from 'src/application/dtos/company/profile/stack/requests/company-tech-stack.dto';
import { IGetCompanyIdByUserIdUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyIdByUserIdUseCase';

export class CompanyTechStackController {
  constructor(
    private readonly _createCompanyTechStackUseCase: ICreateCompanyTechStackUseCase,
    private readonly _updateCompanyTechStackUseCase: IUpdateCompanyTechStackUseCase,
    private readonly _deleteCompanyTechStackUseCase: IDeleteCompanyTechStackUseCase,
    private readonly _getCompanyTechStackUseCase: IGetCompanyTechStackUseCase,
    private readonly _getCompanyIdByUserIdUseCase: IGetCompanyIdByUserIdUseCase,
  ) {}

  getCompanyTechStacks = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const companyId = await this._getCompanyIdByUserIdUseCase.execute(userId);

      const techStacks = await this._getCompanyTechStackUseCase.execute(companyId);
      sendSuccessResponse(res, 'Company tech stacks retrieved successfully', techStacks);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  createCompanyTechStack = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsed = CreateCompanyTechStackDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(`Invalid tech stack data: ${parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`, next);
    }

    try {
      const userId = validateUserId(req);
      const companyId = await this._getCompanyIdByUserIdUseCase.execute(userId);

      const techStack = await this._createCompanyTechStackUseCase.execute({ ...parsed.data, companyId });
      sendSuccessResponse(res, 'Tech stack created successfully', techStack, undefined, 201);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateCompanyTechStack = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsed = UpdateCompanyTechStackDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(`Invalid tech stack data: ${parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`, next);
    }

    try {
      const userId = validateUserId(req);
      const companyId = await this._getCompanyIdByUserIdUseCase.execute(userId);
      const { id } = req.params;

      const techStack = await this._updateCompanyTechStackUseCase.execute(companyId, id, parsed.data);
      sendSuccessResponse(res, 'Tech stack updated successfully', techStack);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteCompanyTechStack = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const companyId = await this._getCompanyIdByUserIdUseCase.execute(userId);
      const { id } = req.params;

      await this._deleteCompanyTechStackUseCase.execute(companyId, id);
      sendSuccessResponse(res, 'Tech stack deleted successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}



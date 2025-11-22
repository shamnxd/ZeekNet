import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request';
import {
  handleValidationError,
  handleAsyncError,
  sendSuccessResponse,
  validateUserId,
  sendNotFoundResponse,
} from '../../../shared/utils/controller.utils';
import {
  ICreateCompanyTechStackUseCase,
  IUpdateCompanyTechStackUseCase,
  IDeleteCompanyTechStackUseCase,
  IGetCompanyTechStackUseCase,
  CompanyTechStackData,
} from '../../../domain/interfaces/use-cases/ICompanyUseCases';
import { CreateCompanyTechStackDto, UpdateCompanyTechStackDto } from '../../../application/dto/company/company-tech-stack.dto';
import { GetCompanyIdByUserIdUseCase } from '../../../application/use-cases/company/get-company-id-by-user-id.use-case';

export class CompanyTechStackController {
  constructor(
    private readonly _createCompanyTechStackUseCase: ICreateCompanyTechStackUseCase,
    private readonly _updateCompanyTechStackUseCase: IUpdateCompanyTechStackUseCase,
    private readonly _deleteCompanyTechStackUseCase: IDeleteCompanyTechStackUseCase,
    private readonly _getCompanyTechStackUseCase: IGetCompanyTechStackUseCase,
    private readonly _getCompanyIdByUserIdUseCase: GetCompanyIdByUserIdUseCase,
  ) {}

  getCompanyTechStacks = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const companyId = await this._getCompanyIdByUserIdUseCase.execute(userId);

      const techStacks = await this._getCompanyTechStackUseCase.executeByCompanyId(companyId);
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

      const techStack = await this._createCompanyTechStackUseCase.execute(companyId, parsed.data);
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

      const existingTechStack = await this._getCompanyTechStackUseCase.executeById(id);
      if (!existingTechStack || existingTechStack.companyId !== companyId) {
        return sendNotFoundResponse(res, 'Tech stack not found or unauthorized');
      }

      const techStack = await this._updateCompanyTechStackUseCase.execute(id, parsed.data as CompanyTechStackData);
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

      const existingTechStack = await this._getCompanyTechStackUseCase.executeById(id);
      if (!existingTechStack || existingTechStack.companyId !== companyId) {
        return sendNotFoundResponse(res, 'Tech stack not found or unauthorized');
      }

      await this._deleteCompanyTechStackUseCase.execute(id);
      sendSuccessResponse(res, 'Tech stack deleted successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}

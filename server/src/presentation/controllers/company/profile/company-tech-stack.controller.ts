import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import {
  handleValidationError,
  handleAsyncError,
  sendSuccessResponse,
  sendCreatedResponse,
  validateUserId,
} from 'src/shared/utils/presentation/controller.utils';
import { ICreateCompanyTechStackUseCase } from 'src/domain/interfaces/use-cases/company/profile/stack/ICreateCompanyTechStackUseCase';
import { IUpdateCompanyTechStackUseCase } from 'src/domain/interfaces/use-cases/company/profile/stack/IUpdateCompanyTechStackUseCase';
import { IDeleteCompanyTechStackUseCase } from 'src/domain/interfaces/use-cases/company/profile/stack/IDeleteCompanyTechStackUseCase';
import { IGetCompanyTechStackUseCase } from 'src/domain/interfaces/use-cases/company/profile/stack/IGetCompanyTechStackUseCase';
import { CreateCompanyTechStackDto, UpdateCompanyTechStackDto } from 'src/application/dtos/company/profile/stack/requests/company-tech-stack.dto';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';
import { HttpStatus } from 'src/domain/enums/http-status.enum';

export class CompanyTechStackController {
  constructor(
    private readonly _createCompanyTechStackUseCase: ICreateCompanyTechStackUseCase,
    private readonly _updateCompanyTechStackUseCase: IUpdateCompanyTechStackUseCase,
    private readonly _deleteCompanyTechStackUseCase: IDeleteCompanyTechStackUseCase,
    private readonly _getCompanyTechStackUseCase: IGetCompanyTechStackUseCase,
  ) { }

  getCompanyTechStacks = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const techStacks = await this._getCompanyTechStackUseCase.execute({ userId });
      sendSuccessResponse(res, 'Company tech stacks retrieved successfully', techStacks);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  createCompanyTechStack = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsed = CreateCompanyTechStackDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const userId = validateUserId(req);
      const techStack = await this._createCompanyTechStackUseCase.execute({ userId, ...parsed.data });
      sendCreatedResponse(res, 'Tech stack created successfully', techStack);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateCompanyTechStack = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsed = UpdateCompanyTechStackDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const userId = validateUserId(req);
      const techStack = await this._updateCompanyTechStackUseCase.execute({ userId, ...parsed.data });
      sendSuccessResponse(res, 'Tech stack updated successfully', techStack);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteCompanyTechStack = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { id } = req.params;
      await this._deleteCompanyTechStackUseCase.execute({ userId, techStackId: id });
      sendSuccessResponse(res, 'Tech stack deleted successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}



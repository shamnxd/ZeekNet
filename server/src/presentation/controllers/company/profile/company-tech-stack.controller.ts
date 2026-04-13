import { injectable, inject } from 'inversify';
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { ICreateCompanyTechStackUseCase } from 'src/domain/interfaces/use-cases/company/profile/stack/ICreateCompanyTechStackUseCase';
import { IUpdateCompanyTechStackUseCase } from 'src/domain/interfaces/use-cases/company/profile/stack/IUpdateCompanyTechStackUseCase';
import { IDeleteCompanyTechStackUseCase } from 'src/domain/interfaces/use-cases/company/profile/stack/IDeleteCompanyTechStackUseCase';
import { IGetCompanyTechStackUseCase } from 'src/domain/interfaces/use-cases/company/profile/stack/IGetCompanyTechStackUseCase';
import { CreateCompanyTechStackDto, UpdateCompanyTechStackDto } from 'src/application/dtos/company/profile/stack/requests/company-tech-stack.dto';
import { handleValidationError, handleAsyncError, sendSuccessResponse, sendCreatedResponse, validateUserId, formatZodErrors } from 'src/shared/utils';
import { SUCCESS } from 'src/shared/constants/messages';
import { TYPES } from 'src/shared/constants/types';

@injectable()
export class CompanyTechStackController {
  constructor(
    @inject(TYPES.CreateCompanyTechStackUseCase) private readonly _createCompanyTechStackUseCase: ICreateCompanyTechStackUseCase,
    @inject(TYPES.UpdateCompanyTechStackUseCase) private readonly _updateCompanyTechStackUseCase: IUpdateCompanyTechStackUseCase,
    @inject(TYPES.DeleteCompanyTechStackUseCase) private readonly _deleteCompanyTechStackUseCase: IDeleteCompanyTechStackUseCase,
    @inject(TYPES.GetCompanyTechStackUseCase) private readonly _getCompanyTechStackUseCase: IGetCompanyTechStackUseCase,
  ) { }

  getCompanyTechStacks = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const techStacks = await this._getCompanyTechStackUseCase.execute({ userId });
      sendSuccessResponse(res, SUCCESS.RETRIEVED('Company tech stacks'), techStacks);
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
      sendCreatedResponse(res, SUCCESS.CREATED('Tech stack'), techStack);
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
      sendSuccessResponse(res, SUCCESS.UPDATED('Tech stack'), techStack);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteCompanyTechStack = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { id } = req.params;
      await this._deleteCompanyTechStackUseCase.execute({ userId, techStackId: id });
      sendSuccessResponse(res, SUCCESS.DELETED('Tech stack'), null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}


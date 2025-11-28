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
  ICreateCompanyBenefitUseCase,
  IUpdateCompanyBenefitUseCase,
  IDeleteCompanyBenefitUseCase,
  IGetCompanyBenefitUseCase,
  CompanyBenefitsData,
} from '../../../domain/interfaces/use-cases/ICompanyUseCases';
import { CreateCompanyBenefitsDto, UpdateCompanyBenefitsDto } from '../../../application/dto/company/company-benefits.dto';
import { IGetCompanyIdByUserIdUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';

export class CompanyBenefitController {
  constructor(
    private readonly _createCompanyBenefitUseCase: ICreateCompanyBenefitUseCase,
    private readonly _updateCompanyBenefitUseCase: IUpdateCompanyBenefitUseCase,
    private readonly _deleteCompanyBenefitUseCase: IDeleteCompanyBenefitUseCase,
    private readonly _getCompanyBenefitUseCase: IGetCompanyBenefitUseCase,
    private readonly _getCompanyIdByUserIdUseCase: IGetCompanyIdByUserIdUseCase,
  ) {}

  getCompanyBenefits = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const companyId = await this._getCompanyIdByUserIdUseCase.execute(userId);

      const benefits = await this._getCompanyBenefitUseCase.executeByCompanyId(companyId);
      sendSuccessResponse(res, 'Company benefits retrieved successfully', benefits);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  createCompanyBenefit = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsed = CreateCompanyBenefitsDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(`Invalid benefit data: ${parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`, next);
    }

    try {
      const userId = validateUserId(req);
      const companyId = await this._getCompanyIdByUserIdUseCase.execute(userId);

      const benefit = await this._createCompanyBenefitUseCase.execute(companyId, parsed.data as CompanyBenefitsData);
      sendSuccessResponse(res, 'Benefit created successfully', benefit, undefined, 201);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateCompanyBenefit = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsed = UpdateCompanyBenefitsDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(`Invalid benefit data: ${parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`, next);
    }

    try {
      const userId = validateUserId(req);
      const companyId = await this._getCompanyIdByUserIdUseCase.execute(userId);
      const { id } = req.params;

      const benefit = await this._updateCompanyBenefitUseCase.execute(companyId, id, parsed.data as CompanyBenefitsData);
      sendSuccessResponse(res, 'Benefit updated successfully', benefit);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteCompanyBenefit = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const companyId = await this._getCompanyIdByUserIdUseCase.execute(userId);
      const { id } = req.params;

      await this._deleteCompanyBenefitUseCase.execute(companyId, id);
      sendSuccessResponse(res, 'Benefit deleted successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}

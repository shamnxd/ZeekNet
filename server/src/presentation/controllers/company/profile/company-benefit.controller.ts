import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import {
  handleValidationError,
  handleAsyncError,
  sendSuccessResponse,
  sendCreatedResponse,
  validateUserId,
} from 'src/shared/utils/presentation/controller.utils';
import { ICreateCompanyBenefitUseCase } from 'src/domain/interfaces/use-cases/company/profile/benefits/ICreateCompanyBenefitUseCase';
import { IUpdateCompanyBenefitUseCase } from 'src/domain/interfaces/use-cases/company/profile/benefits/IUpdateCompanyBenefitUseCase';
import { IDeleteCompanyBenefitUseCase } from 'src/domain/interfaces/use-cases/company/profile/benefits/IDeleteCompanyBenefitUseCase';
import { IGetCompanyBenefitUseCase } from 'src/domain/interfaces/use-cases/company/profile/benefits/IGetCompanyBenefitUseCase';
import { CreateCompanyBenefitsDto, UpdateCompanyBenefitsDto } from 'src/application/dtos/company/profile/benefits/requests/company-benefits.dto';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';

export class CompanyBenefitController {
  constructor(
    private readonly _createCompanyBenefitUseCase: ICreateCompanyBenefitUseCase,
    private readonly _updateCompanyBenefitUseCase: IUpdateCompanyBenefitUseCase,
    private readonly _deleteCompanyBenefitUseCase: IDeleteCompanyBenefitUseCase,
    private readonly _getCompanyBenefitUseCase: IGetCompanyBenefitUseCase,
  ) { }

  getCompanyBenefits = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const benefits = await this._getCompanyBenefitUseCase.execute({ userId });
      sendSuccessResponse(res, 'Company benefits retrieved successfully', benefits);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  createCompanyBenefit = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsed = CreateCompanyBenefitsDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const userId = validateUserId(req);
      const benefit = await this._createCompanyBenefitUseCase.execute({ userId, ...parsed.data });
      sendCreatedResponse(res, 'Benefit created successfully', benefit);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateCompanyBenefit = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const parsed = UpdateCompanyBenefitsDto.safeParse({ ...req.body, benefitId: id });
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const userId = validateUserId(req);
      const benefit = await this._updateCompanyBenefitUseCase.execute({ userId, ...parsed.data });
      sendSuccessResponse(res, 'Benefit updated successfully', benefit);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteCompanyBenefit = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { id } = req.params;
      await this._deleteCompanyBenefitUseCase.execute({ userId, benefitId: id });
      sendSuccessResponse(res, 'Benefit deleted successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}

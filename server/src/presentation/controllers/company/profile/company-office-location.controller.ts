import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import {
  handleValidationError,
  handleAsyncError,
  sendSuccessResponse,
  sendCreatedResponse,
  validateUserId,
} from 'src/shared/utils/presentation/controller.utils';
import { CreateCompanyOfficeLocationDto, UpdateCompanyOfficeLocationDto } from 'src/application/dtos/company/profile/location/requests/company-office-location.dto';
import { ICreateCompanyOfficeLocationUseCase } from 'src/domain/interfaces/use-cases/company/profile/location/ICreateCompanyOfficeLocationUseCase';
import { IUpdateCompanyOfficeLocationUseCase } from 'src/domain/interfaces/use-cases/company/profile/location/IUpdateCompanyOfficeLocationUseCase';
import { IDeleteCompanyOfficeLocationUseCase } from 'src/domain/interfaces/use-cases/company/profile/location/IDeleteCompanyOfficeLocationUseCase';
import { IGetCompanyOfficeLocationUseCase } from 'src/domain/interfaces/use-cases/company/profile/location/IGetCompanyOfficeLocationUseCase';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';

export class CompanyOfficeLocationController {
  constructor(
    private readonly _createCompanyOfficeLocationUseCase: ICreateCompanyOfficeLocationUseCase,
    private readonly _updateCompanyOfficeLocationUseCase: IUpdateCompanyOfficeLocationUseCase,
    private readonly _deleteCompanyOfficeLocationUseCase: IDeleteCompanyOfficeLocationUseCase,
    private readonly _getCompanyOfficeLocationUseCase: IGetCompanyOfficeLocationUseCase,
  ) { }

  getCompanyOfficeLocations = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const locations = await this._getCompanyOfficeLocationUseCase.execute({ userId });
      sendSuccessResponse(res, 'Company office locations retrieved successfully', locations);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  createCompanyOfficeLocation = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsed = CreateCompanyOfficeLocationDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const userId = validateUserId(req);
      const location = await this._createCompanyOfficeLocationUseCase.execute({ userId, ...parsed.data });
      sendCreatedResponse(res, 'Office location created successfully', location);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateCompanyOfficeLocation = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsed = UpdateCompanyOfficeLocationDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const userId = validateUserId(req);
      const location = await this._updateCompanyOfficeLocationUseCase.execute({ userId, ...parsed.data });
      sendSuccessResponse(res, 'Office location updated successfully', location);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteCompanyOfficeLocation = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { id } = req.params;
      await this._deleteCompanyOfficeLocationUseCase.execute({ userId, locationId: id });
      sendSuccessResponse(res, 'Office location deleted successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}

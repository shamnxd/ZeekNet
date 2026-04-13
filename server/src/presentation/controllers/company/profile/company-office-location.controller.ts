import { injectable, inject } from 'inversify';
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { CreateCompanyOfficeLocationDto, UpdateCompanyOfficeLocationDto } from 'src/application/dtos/company/profile/location/requests/company-office-location.dto';
import { ICreateCompanyOfficeLocationUseCase } from 'src/domain/interfaces/use-cases/company/profile/location/ICreateCompanyOfficeLocationUseCase';
import { IUpdateCompanyOfficeLocationUseCase } from 'src/domain/interfaces/use-cases/company/profile/location/IUpdateCompanyOfficeLocationUseCase';
import { IDeleteCompanyOfficeLocationUseCase } from 'src/domain/interfaces/use-cases/company/profile/location/IDeleteCompanyOfficeLocationUseCase';
import { IGetCompanyOfficeLocationUseCase } from 'src/domain/interfaces/use-cases/company/profile/location/IGetCompanyOfficeLocationUseCase';
import { formatZodErrors, handleAsyncError, handleValidationError, sendSuccessResponse, sendCreatedResponse, validateUserId } from 'src/shared/utils';
import { SUCCESS } from 'src/shared/constants/messages';
import { TYPES } from 'src/shared/constants/types';

@injectable()
export class CompanyOfficeLocationController {
  constructor(
    @inject(TYPES.CreateCompanyOfficeLocationUseCase) private readonly _createCompanyOfficeLocationUseCase: ICreateCompanyOfficeLocationUseCase,
    @inject(TYPES.UpdateCompanyOfficeLocationUseCase) private readonly _updateCompanyOfficeLocationUseCase: IUpdateCompanyOfficeLocationUseCase,
    @inject(TYPES.DeleteCompanyOfficeLocationUseCase) private readonly _deleteCompanyOfficeLocationUseCase: IDeleteCompanyOfficeLocationUseCase,
    @inject(TYPES.GetCompanyOfficeLocationUseCase) private readonly _getCompanyOfficeLocationUseCase: IGetCompanyOfficeLocationUseCase,
  ) { }

  getCompanyOfficeLocations = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const locations = await this._getCompanyOfficeLocationUseCase.execute({ userId });
      sendSuccessResponse(res, SUCCESS.RETRIEVED('Company office locations'), locations);
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
      sendCreatedResponse(res, SUCCESS.CREATED('Office location'), location);
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
      sendSuccessResponse(res, SUCCESS.UPDATED('Office location'), location);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteCompanyOfficeLocation = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { id } = req.params;
      await this._deleteCompanyOfficeLocationUseCase.execute({ userId, locationId: id });
      sendSuccessResponse(res, SUCCESS.DELETED('Office location'), null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}


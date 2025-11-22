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
  ICreateCompanyOfficeLocationUseCase,
  IUpdateCompanyOfficeLocationUseCase,
  IDeleteCompanyOfficeLocationUseCase,
  IGetCompanyOfficeLocationUseCase,
  CompanyOfficeLocationData,
} from '../../../domain/interfaces/use-cases/ICompanyUseCases';
import { CreateCompanyOfficeLocationDto, UpdateCompanyOfficeLocationDto } from '../../../application/dto/company/company-office-location.dto';
import { GetCompanyIdByUserIdUseCase } from '../../../application/use-cases/company/get-company-id-by-user-id.use-case';

export class CompanyOfficeLocationController {
  constructor(
    private readonly _createCompanyOfficeLocationUseCase: ICreateCompanyOfficeLocationUseCase,
    private readonly _updateCompanyOfficeLocationUseCase: IUpdateCompanyOfficeLocationUseCase,
    private readonly _deleteCompanyOfficeLocationUseCase: IDeleteCompanyOfficeLocationUseCase,
    private readonly _getCompanyOfficeLocationUseCase: IGetCompanyOfficeLocationUseCase,
    private readonly _getCompanyIdByUserIdUseCase: GetCompanyIdByUserIdUseCase,
  ) {}

  getCompanyOfficeLocations = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const companyId = await this._getCompanyIdByUserIdUseCase.execute(userId);

      const locations = await this._getCompanyOfficeLocationUseCase.executeByCompanyId(companyId);
      sendSuccessResponse(res, 'Company office locations retrieved successfully', locations);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  createCompanyOfficeLocation = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsed = CreateCompanyOfficeLocationDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(`Invalid office location data: ${parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`, next);
    }

    try {
      const userId = validateUserId(req);
      const companyId = await this._getCompanyIdByUserIdUseCase.execute(userId);

      const location = await this._createCompanyOfficeLocationUseCase.execute(companyId, parsed.data);
      sendSuccessResponse(res, 'Office location created successfully', location, undefined, 201);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateCompanyOfficeLocation = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsed = UpdateCompanyOfficeLocationDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(`Invalid office location data: ${parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`, next);
    }

    try {
      const userId = validateUserId(req);
      const companyId = await this._getCompanyIdByUserIdUseCase.execute(userId);
      const { id } = req.params;

      const existingLocation = await this._getCompanyOfficeLocationUseCase.executeById(id);
      if (!existingLocation || existingLocation.companyId !== companyId) {
        return sendNotFoundResponse(res, 'Office location not found or unauthorized');
      }

      const location = await this._updateCompanyOfficeLocationUseCase.execute(id, parsed.data as CompanyOfficeLocationData);
      sendSuccessResponse(res, 'Office location updated successfully', location);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteCompanyOfficeLocation = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const companyId = await this._getCompanyIdByUserIdUseCase.execute(userId);
      const { id } = req.params;

      const existingLocation = await this._getCompanyOfficeLocationUseCase.executeById(id);
      if (!existingLocation || existingLocation.companyId !== companyId) {
        return sendNotFoundResponse(res, 'Office location not found or unauthorized');
      }

      await this._deleteCompanyOfficeLocationUseCase.execute(id);
      sendSuccessResponse(res, 'Office location deleted successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}

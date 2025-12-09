import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request';
import {
  handleValidationError,
  handleAsyncError,
  sendSuccessResponse,
  validateUserId,
  sendNotFoundResponse,
} from '../../../shared/utils/controller.utils';
import {
  ICreateCompanyProfileFromDtoUseCase,
  IUpdateCompanyProfileUseCase,
  IGetCompanyProfileWithJobPostingsUseCase,
  IReapplyCompanyVerificationUseCase,
  IGetCompanyDashboardUseCase,
  IUploadLogoUseCase,
} from '../../../domain/interfaces/use-cases/ICompanyUseCases';
import { SimpleCompanyProfileDto } from '../../../application/dto/company/create-company.dto';
import { SimpleUpdateCompanyProfileDto } from '../../../application/dto/company/company-profile.dto';

export class CompanyProfileController {
  constructor(
    private readonly _createCompanyProfileFromDtoUseCase: ICreateCompanyProfileFromDtoUseCase,
    private readonly _updateCompanyProfileUseCase: IUpdateCompanyProfileUseCase,
    private readonly _getCompanyProfileWithJobPostingsUseCase: IGetCompanyProfileWithJobPostingsUseCase,
    private readonly _reapplyCompanyVerificationUseCase: IReapplyCompanyVerificationUseCase,
    private readonly _getCompanyDashboardUseCase: IGetCompanyDashboardUseCase,
    private readonly _uploadLogoUseCase: IUploadLogoUseCase,
  ) {}

  createCompanyProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsed = SimpleCompanyProfileDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(`Invalid profile data: ${parsed.error.errors.map((e: { path: { join: (arg: string) => string }; message: string }) => `${e.path.join('.')}: ${e.message}`).join(', ')}`, next);
    }

    try {
      const userId = validateUserId(req);
      const profile = await this._createCompanyProfileFromDtoUseCase.execute({ userId, ...parsed.data });

      sendSuccessResponse(res, 'Company profile created successfully', profile, undefined, 201);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateCompanyProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsed = SimpleUpdateCompanyProfileDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(`Invalid company profile data: ${parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`, next);
    }

    try {
      const userId = validateUserId(req);
      const companyProfile = await this._updateCompanyProfileUseCase.execute({ userId, ...parsed.data });

      sendSuccessResponse(res, 'Company profile updated successfully', companyProfile, undefined, 200);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getCompanyProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const responseData = await this._getCompanyProfileWithJobPostingsUseCase.execute(userId);
      sendSuccessResponse(res, 'Company profile retrieved successfully', responseData);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getCompanyProfileById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { profileId } = req.params;
      if (!profileId) {
        return sendNotFoundResponse(res, 'Profile ID is required');
      }
      sendNotFoundResponse(res, 'Method not implemented');
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getCompanyDashboard = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const dashboardData = await this._getCompanyDashboardUseCase.execute(userId);
      sendSuccessResponse(res, 'Company dashboard data retrieved successfully', dashboardData);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  reapplyVerification = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const parsed = SimpleCompanyProfileDto.safeParse(req.body);
      if (!parsed.success) {
        return handleValidationError(`Invalid verification data: ${parsed.error.errors.map((e: { path: { join: (arg: string) => string }; message: string }) => `${e.path.join('.')}: ${e.message}`).join(', ')}`, next);
      }

      const verificationData = {
        userId,
        taxId: parsed.data.tax_id,
        businessLicenseUrl: parsed.data.business_license,
      };
      const updatedProfile = await this._reapplyCompanyVerificationUseCase.execute(verificationData);

      sendSuccessResponse(res, 'Verification reapplication submitted successfully. Your application is now under review.', updatedProfile);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  uploadLogo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const file = req.file;

      if (!file) {
        return handleValidationError('No logo uploaded', next);
      }

      const result = await this._uploadLogoUseCase.execute({
        buffer: file.buffer,
        originalname: file.originalname,
        mimetype: file.mimetype,
      });
      sendSuccessResponse(res, 'Logo uploaded successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}

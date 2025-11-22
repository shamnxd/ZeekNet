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
  ICreateCompanyProfileUseCase,
  IUpdateCompanyProfileUseCase,
  IGetCompanyProfileUseCase,
  IReapplyCompanyVerificationUseCase,
  IGetCompanyJobPostingsUseCase,
} from '../../../domain/interfaces/use-cases/ICompanyUseCases';
import { SimpleCompanyProfileDto } from '../../../application/dto/company/create-company.dto';
import { SimpleUpdateCompanyProfileDto } from '../../../application/dto/company/company-profile.dto';
import { CompanyProfileMapper } from '../../../application/mappers/company-profile.mapper';
import { UploadLogoUseCase } from '../../../application/use-cases/company/upload-logo.use-case';

export class CompanyProfileController {
  constructor(
    private readonly _createCompanyProfileUseCase: ICreateCompanyProfileUseCase,
    private readonly _updateCompanyProfileUseCase: IUpdateCompanyProfileUseCase,
    private readonly _getCompanyProfileUseCase: IGetCompanyProfileUseCase,
    private readonly _reapplyCompanyVerificationUseCase: IReapplyCompanyVerificationUseCase,
    private readonly _getCompanyJobPostingsUseCase: IGetCompanyJobPostingsUseCase,
    private readonly _uploadLogoUseCase: UploadLogoUseCase,
  ) {}

  createCompanyProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsed = SimpleCompanyProfileDto.safeParse(req.body);
    if (!parsed.success) {
      console.error('Company profile validation failed:', {
        body: req.body,
        errors: parsed.error.errors.map((err: { path: unknown[]; message: string; code: string }) => ({
          path: err.path,
          message: err.message,
          code: err.code,
        })),
      });
      return handleValidationError(`Invalid profile data: ${parsed.error.errors.map((e: { path: { join: (arg: string) => string }; message: string }) => `${e.path.join('.')}: ${e.message}`).join(', ')}`, next);
    }

    try {
      const userId = validateUserId(req);
      const profileData = {
        companyName: parsed.data.company_name,
        logo: parsed.data.logo || '/default-logo.png',
        banner: '/default-banner.png',
        websiteLink: parsed.data.website || '',
        employeeCount: parseInt(parsed.data.employees),
        industry: parsed.data.industry,
        organisation: parsed.data.organisation,
        aboutUs: parsed.data.description,
        taxId: parsed.data.tax_id,
        businessLicenseUrl: parsed.data.business_license,
        email: parsed.data.email,
        location: parsed.data.location,
      };
      const profile = await this._createCompanyProfileUseCase.execute(userId, profileData);

      sendSuccessResponse(res, 'Company profile created successfully', profile, undefined, 201);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateCompanyProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsed = SimpleUpdateCompanyProfileDto.safeParse(req.body);
    if (!parsed.success) {
      console.error('Company profile update validation failed:', {
        body: req.body,
        errors: parsed.error.errors.map((err) => ({
          path: err.path,
          message: err.message,
          code: err.code,
        })),
      });
      return handleValidationError(`Invalid company profile data: ${parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`, next);
    }

    try {
      const userId = validateUserId(req);
      const updateData = {
        profile: parsed.data,
      };
      const companyProfile = await this._updateCompanyProfileUseCase.execute(userId, updateData);

      sendSuccessResponse(res, 'Company profile updated successfully', companyProfile, undefined, 200);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getCompanyProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const companyProfile = await this._getCompanyProfileUseCase.execute(userId);

      if (!companyProfile) {
        return sendNotFoundResponse(res, 'Company profile not found');
      }

      const jobPostingsQuery = {
        page: 1,
        limit: 3,
        is_active: true,
        category_ids: undefined,
        employment_types: undefined,
        salary_min: undefined,
        salary_max: undefined,
        location: undefined,
        search: undefined,
      };

      const jobPostings = await this._getCompanyJobPostingsUseCase.execute(userId, jobPostingsQuery);

      const responseData = CompanyProfileMapper.toDetailedDto({
        ...companyProfile,
        jobPostings: jobPostings.jobs,
      });
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
      const companyProfile = await this._getCompanyProfileUseCase.execute(userId);

      const dashboardData = {
        hasProfile: !!companyProfile,
        profile: companyProfile,
        profileStatus: companyProfile?.profile.isVerified || 'not_created',
      };

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
        taxId: parsed.data.tax_id,
        businessLicenseUrl: parsed.data.business_license,
      };
      const updatedProfile = await this._reapplyCompanyVerificationUseCase.execute(userId, verificationData);

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

      const result = await this._uploadLogoUseCase.execute(file.buffer, file.originalname, file.mimetype);
      sendSuccessResponse(res, 'Logo uploaded successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}

import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import {
  handleValidationError,
  handleAsyncError,
  sendSuccessResponse,
  sendCreatedResponse,
  validateUserId,
  sendNotFoundResponse,
} from 'src/shared/utils/presentation/controller.utils';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';
import { SimpleCompanyProfileDto } from 'src/application/dtos/company/requests/create-company.dto';
import { SimpleUpdateCompanyProfileDto } from 'src/application/dtos/company/profile/info/requests/company-profile.dto';
import { IUpdateCompanyProfileUseCase } from 'src/domain/interfaces/use-cases/company/profile/info/IUpdateCompanyProfileUseCase';
import { ICreateCompanyProfileFromDtoUseCase } from 'src/domain/interfaces/use-cases/company/profile/info/ICreateCompanyProfileFromDtoUseCase';
import { IGetCompanyProfileWithJobPostingsUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyProfileWithJobPostingsUseCase';
import { IReapplyCompanyVerificationUseCase } from 'src/domain/interfaces/use-cases/company/profile/verification/IReapplyCompanyVerificationUseCase';
import { IUploadLogoUseCase } from 'src/domain/interfaces/use-cases/company/media/IUploadLogoUseCase';

export class CompanyProfileController {
  constructor(
    private readonly _createCompanyProfileFromDtoUseCase: ICreateCompanyProfileFromDtoUseCase,
    private readonly _updateCompanyProfileUseCase: IUpdateCompanyProfileUseCase,
    private readonly _getCompanyProfileWithJobPostingsUseCase: IGetCompanyProfileWithJobPostingsUseCase,
    private readonly _reapplyCompanyVerificationUseCase: IReapplyCompanyVerificationUseCase,
    private readonly _uploadLogoUseCase: IUploadLogoUseCase,
  ) { }

  createCompanyProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsed = SimpleCompanyProfileDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const userId = validateUserId(req);
      const profile = await this._createCompanyProfileFromDtoUseCase.execute({ userId, ...parsed.data });

      sendCreatedResponse(res, 'Company profile created successfully', profile);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateCompanyProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsed = SimpleUpdateCompanyProfileDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const userId = validateUserId(req);
      const companyProfile = await this._updateCompanyProfileUseCase.execute({ userId, ...parsed.data });

      sendSuccessResponse(res, 'Company profile updated successfully', companyProfile);
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


  reapplyVerification = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsed = SimpleCompanyProfileDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const userId = validateUserId(req);
      const reapplicationData = {
        userId,
        company_name: parsed.data.company_name,
        email: parsed.data.email,
        website: parsed.data.website || '',
        industry: parsed.data.industry,
        organisation: parsed.data.organisation,
        location: parsed.data.location,
        employees: parsed.data.employees,
        description: parsed.data.description,
        logo: parsed.data.logo || '',
        tax_id: parsed.data.tax_id,
        business_license: parsed.data.business_license || '',
      };
      const updatedProfile = await this._reapplyCompanyVerificationUseCase.execute(reapplicationData);

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

      const userId = validateUserId(req as AuthenticatedRequest);
      const result = await this._uploadLogoUseCase.execute({
        buffer: file.buffer,
        originalname: file.originalname,
        mimetype: file.mimetype,
        userId,
      });
      sendSuccessResponse(res, 'Logo uploaded successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}




import { Response, NextFunction } from 'express';
import { ICompanyProfileRepository } from '../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { UserRole } from '../../domain/enums/user-role.enum';
import { AuthenticatedRequest } from '../../shared/types/authenticated-request';
import { sendUnauthorizedResponse, sendForbiddenResponse } from '../../shared/utils/presentation/controller.utils';

export class CompanyVerificationMiddleware {
  constructor(private readonly _companyProfileRepository: ICompanyProfileRepository) {}

  checkCompanyVerified = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.role;

      if (userRole !== UserRole.COMPANY) {
        return next();
      }

      if (!userId) {
        sendUnauthorizedResponse(res, 'User not authenticated');
        return;
      }

      const companyProfile = await this._companyProfileRepository.findOne({ userId });

      if (!companyProfile) {
        sendForbiddenResponse(res, 'Company profile not found. Please complete your profile setup.');
        return;
      }

      if (companyProfile.isVerified !== 'verified') {
        sendForbiddenResponse(res, 'Company profile is not verified. Please wait for admin approval.', {
          verificationStatus: companyProfile.isVerified,
          profileId: companyProfile.id,
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Error in company verification middleware:', error);
      next(error);
    }
  };
}


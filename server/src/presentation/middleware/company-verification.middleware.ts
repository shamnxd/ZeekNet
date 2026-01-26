import { Response, NextFunction } from 'express';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { sendUnauthorizedResponse, sendForbiddenResponse, validateUserId } from 'src/shared/utils/presentation/controller.utils';

export class CompanyVerificationMiddleware {
  constructor(private readonly _companyProfileRepository: ICompanyProfileRepository) { }

  checkCompanyVerified = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userRole = req.user?.role;

      if (userRole !== UserRole.COMPANY) {
        return next();
      }

      const userId = validateUserId(req);
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
      next(error);
    }
  };
}


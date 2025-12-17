import { Request, Response, NextFunction } from 'express';
import { ICompanyProfileRepository } from '../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { UserRole } from '../../domain/enums/user-role.enum';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    userId: string;
    email: string;
    role: string;
  };
}

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
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
          data: null,
        });
        return;
      }

      const companyProfile = await this._companyProfileRepository.findOne({ userId });

      if (!companyProfile) {
        res.status(403).json({
          success: false,
          message: 'Company profile not found. Please complete your profile setup.',
          data: null,
        });
        return;
      }

      if (companyProfile.isVerified !== 'verified') {
        res.status(403).json({
          success: false,
          message: 'Company profile is not verified. Please wait for admin approval.',
          data: {
            verificationStatus: companyProfile.isVerified,
            profileId: companyProfile.id,
          },
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
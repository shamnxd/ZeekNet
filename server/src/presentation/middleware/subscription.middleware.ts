import { Response, NextFunction } from 'express';
import { ICompanySubscriptionRepository } from '../../domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { ICompanyProfileRepository } from '../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { CompanySubscription } from '../../domain/entities/company-subscription.entity';
import { AuthenticatedRequest } from './auth.middleware';

export class SubscriptionMiddleware {
  constructor(
    private _companySubscriptionRepository: ICompanySubscriptionRepository,
    private _companyProfileRepository: ICompanyProfileRepository,
  ) {}

  /**
   * Middleware to check if company has an active subscription
   */
  checkActiveSubscription = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      // Get company profile
      const companyProfile = await this._companyProfileRepository.findOne({ userId });
      
      if (!companyProfile) {
        return res.status(404).json({
          success: false,
          message: 'Company profile not found',
        });
      }

      const subscription = await this._companySubscriptionRepository.findActiveByCompanyId(companyProfile.id);
      
      if (!subscription) {
        return res.status(403).json({
          success: false,
          message: 'No active subscription found. Please subscribe to a plan to continue.',
        });
      }

      if (subscription.isExpired()) {
        return res.status(403).json({
          success: false,
          message: 'Your subscription has expired. Please renew to continue.',
        });
      }

      // Attach subscription to request for use in route handlers
      (req as AuthenticatedRequest & { subscription: typeof subscription }).subscription = subscription;
      
      next();
    } catch (error) {
      next(error);
    }
  };

  /**
   * Middleware to check if company can post a job
   */
  checkCanPostJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const subscription = (req as AuthenticatedRequest & { subscription?: CompanySubscription }).subscription;
      
      if (!subscription) {
        return res.status(403).json({
          success: false,
          message: 'No active subscription found',
        });
      }

      if (!subscription.canPostJob()) {
        return res.status(403).json({
          success: false,
          message: `You have reached your job posting limit of ${subscription.jobPostLimit} jobs. Please upgrade your plan.`,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };

  /**
   * Middleware to check if company can post a featured job
   */
  checkCanPostFeaturedJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const subscription = (req as AuthenticatedRequest & { subscription?: CompanySubscription }).subscription;
      const isFeatured = req.body.is_featured || req.body.isFeatured;
      
      // If not featured, skip check
      if (!isFeatured) {
        return next();
      }

      if (!subscription) {
        return res.status(403).json({
          success: false,
          message: 'No active subscription found',
        });
      }

      if (!subscription.canPostFeaturedJob()) {
        return res.status(403).json({
          success: false,
          message: `You have reached your featured job limit of ${subscription.featuredJobLimit} featured jobs. Please upgrade your plan.`,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

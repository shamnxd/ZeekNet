import { Response, NextFunction } from 'express';
import { ICompanySubscriptionRepository } from 'src/domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ISubscriptionPlanRepository } from 'src/domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { CompanySubscription } from 'src/domain/entities/company-subscription.entity';
import { AuthenticatedRequest } from 'src/presentation/middleware/auth.middleware';
import { sendUnauthorizedResponse, sendNotFoundResponse, sendForbiddenResponse } from 'src/shared/utils/presentation/controller.utils';

export class SubscriptionMiddleware {
  constructor(
    private _companySubscriptionRepository: ICompanySubscriptionRepository,
    private _companyProfileRepository: ICompanyProfileRepository,
    private _subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) { }

  checkActiveSubscription = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return sendUnauthorizedResponse(res, 'User not authenticated');
      }

      const companyProfile = await this._companyProfileRepository.findOne({ userId });

      if (!companyProfile) {
        return sendNotFoundResponse(res, 'Company profile not found');
      }

      let subscription = await this._companySubscriptionRepository.findActiveByCompanyId(companyProfile.id);

      // If subscription is expired, fall back to default plan
      if (!subscription || (subscription && subscription.isExpired() && !subscription.isDefault)) {
        const defaultPlan = await this._subscriptionPlanRepository.findDefault();
        if (defaultPlan) {
          // If subscription exists but is expired, update it to default plan in database
          if (subscription && subscription.isExpired()) {
            await this._companySubscriptionRepository.update(subscription.id, {
              planId: defaultPlan.id,
              startDate: null,
              expiryDate: null,
              isActive: true,
            });
          }
          // Create a subscription object representing the default plan
          subscription = CompanySubscription.create({
            id: subscription?.id || '',
            companyId: companyProfile.id,
            planId: defaultPlan.id,
            startDate: null,
            expiryDate: null,
            isActive: true,
            jobPostsUsed: subscription?.jobPostsUsed || 0,
            featuredJobsUsed: subscription?.featuredJobsUsed || 0,
            applicantAccessUsed: subscription?.applicantAccessUsed || 0,
            planName: defaultPlan.name,
            jobPostLimit: defaultPlan.jobPostLimit,
            featuredJobLimit: defaultPlan.featuredJobLimit,
            applicantAccessLimit: defaultPlan.applicantAccessLimit,
            isDefault: true,
          });
        } else {
          return sendForbiddenResponse(res, 'No active subscription found. Please subscribe to a plan to continue.');
        }
      }

      (req as AuthenticatedRequest & { subscription: typeof subscription }).subscription = subscription;

      next();
    } catch (error) {
      next(error);
    }
  };

  checkCanPostJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const subscription = (req as AuthenticatedRequest & { subscription?: CompanySubscription }).subscription;

      if (!subscription) {
        return sendForbiddenResponse(res, 'No active subscription found');
      }

      if (!subscription.canPostJob()) {
        return sendForbiddenResponse(res, `You have reached your job posting limit of ${subscription.jobPostLimit} jobs. Please upgrade your plan.`, {
          limitExceeded: true,
          currentLimit: subscription.jobPostLimit,
          used: subscription.jobPostsUsed,
          type: 'jobPost',
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };

  checkCanPostFeaturedJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const subscription = (req as AuthenticatedRequest & { subscription?: CompanySubscription }).subscription;
      const isFeatured = req.body.is_featured || req.body.isFeatured;

      if (!isFeatured) {
        return next();
      }

      if (!subscription) {
        return sendForbiddenResponse(res, 'No active subscription found');
      }

      if (!subscription.canPostFeaturedJob()) {
        return sendForbiddenResponse(res, `You have reached your featured job limit of ${subscription.featuredJobLimit} featured jobs. Please upgrade your plan.`, {
          limitExceeded: true,
          currentLimit: subscription.featuredJobLimit,
          used: subscription.featuredJobsUsed,
          type: 'featuredJob',
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };

  checkCanViewCandidate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return sendUnauthorizedResponse(res, 'User not authenticated');
      }

      const companyProfile = await this._companyProfileRepository.findOne({ userId });

      if (!companyProfile) {
        return sendNotFoundResponse(res, 'Company profile not found');
      }

      let subscription = await this._companySubscriptionRepository.findActiveByCompanyId(companyProfile.id);

      // If subscription is expired, fall back to default plan
      if (!subscription || (subscription && subscription.isExpired() && !subscription.isDefault)) {
        const defaultPlan = await this._subscriptionPlanRepository.findDefault();
        if (defaultPlan) {
          if (subscription && subscription.isExpired()) {
            await this._companySubscriptionRepository.update(subscription.id, {
              planId: defaultPlan.id,
              startDate: null,
              expiryDate: null,
              isActive: true,
            });
            subscription = CompanySubscription.create({
              id: subscription.id,
              companyId: companyProfile.id,
              planId: defaultPlan.id,
              startDate: null,
              expiryDate: null,
              isActive: true,
              jobPostsUsed: subscription.jobPostsUsed,
              featuredJobsUsed: subscription.featuredJobsUsed,
              applicantAccessUsed: subscription.applicantAccessUsed,
              planName: defaultPlan.name,
              jobPostLimit: defaultPlan.jobPostLimit,
              featuredJobLimit: defaultPlan.featuredJobLimit,
              applicantAccessLimit: defaultPlan.applicantAccessLimit,
              isDefault: true,
            });
          } else {
            subscription = await this._companySubscriptionRepository.create({
              companyId: companyProfile.id,
              planId: defaultPlan.id,
              isActive: true,
              startDate: null,
              expiryDate: null,
              jobPostsUsed: 0,
              featuredJobsUsed: 0,
              applicantAccessUsed: 0,
            } as any);
          }
        } else {
          return sendForbiddenResponse(res, 'No active subscription found. Please subscribe to a plan to continue.');
        }
      }

      // Get the plan to check applicant access limit
      const plan = await this._subscriptionPlanRepository.findById(subscription.planId);
      const applicantAccessLimit = plan?.applicantAccessLimit || subscription.applicantAccessLimit || -1;

      if (!subscription.canViewCandidate(applicantAccessLimit)) {
        return sendForbiddenResponse(res, `You have reached your candidate view limit of ${applicantAccessLimit} views. Please upgrade your plan to view more candidates.`, {
          limitExceeded: true,
          currentLimit: applicantAccessLimit,
          used: subscription.applicantAccessUsed,
        });
      }

      // Increment the view count
      await this._companySubscriptionRepository.incrementApplicantAccessUsed(subscription.id);

      (req as AuthenticatedRequest & { subscription: typeof subscription }).subscription = subscription;

      next();
    } catch (error) {
      next(error);
    }
  };
}


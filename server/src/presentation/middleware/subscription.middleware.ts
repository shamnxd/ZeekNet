import { injectable, inject } from 'inversify';
import { Response, NextFunction } from 'express';
import { TYPES } from 'src/shared/constants/types';
import { ICompanySubscriptionRepository } from 'src/domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ISubscriptionPlanRepository } from 'src/domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { CompanySubscription } from 'src/domain/entities/company-subscription.entity';
import { AuthenticatedRequest } from 'src/presentation/middleware/auth.middleware';
import { sendUnauthorizedResponse, sendNotFoundResponse, sendForbiddenResponse } from 'src/shared/utils';
import { CreateInput } from 'src/domain/types/common.types';
import { ERROR, AUTH, SUBSCRIPTION } from 'src/shared/constants/messages';

@injectable()
export class SubscriptionMiddleware {

  constructor(
    @inject(TYPES.CompanySubscriptionRepository) private _companySubscriptionRepository: ICompanySubscriptionRepository,
    @inject(TYPES.CompanyProfileRepository) private _companyProfileRepository: ICompanyProfileRepository,
    @inject(TYPES.SubscriptionPlanRepository) private _subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) { }

  checkActiveSubscription = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return sendUnauthorizedResponse(res, ERROR.UNAUTHORIZED);
      }


      const companyProfile = await this._companyProfileRepository.findOne({ userId });

      if (!companyProfile) {
        return sendNotFoundResponse(res, ERROR.NOT_FOUND('Company profile'));
      }


      let subscription = await this._companySubscriptionRepository.findActiveByCompanyId(companyProfile.id);

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
          }
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
          return sendForbiddenResponse(res, SUBSCRIPTION.NO_ACTIVE_SUBSCRIPTION);
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
        return sendForbiddenResponse(res, SUBSCRIPTION.NO_ACTIVE_SUBSCRIPTION);
      }


      if (!subscription.canPostJob()) {
        const limit = subscription.jobPostLimit ?? 0;
        return sendForbiddenResponse(res, SUBSCRIPTION.LIMIT_EXCEEDED(limit, 'job posting'), {

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
        return sendForbiddenResponse(res, SUBSCRIPTION.NO_ACTIVE_SUBSCRIPTION);
      }


      if (!subscription.canPostFeaturedJob()) {
        const limit = subscription.featuredJobLimit ?? 0;
        return sendForbiddenResponse(res, SUBSCRIPTION.LIMIT_EXCEEDED(limit, 'featured job'), {

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
      const accessContext = typeof req.query.context === 'string' ? req.query.context : undefined;
      if (accessContext === 'application') {
        return next();
      }

      const userId = req.user?.userId;

      if (!userId) {
        return sendUnauthorizedResponse(res, ERROR.UNAUTHORIZED);
      }


      const companyProfile = await this._companyProfileRepository.findOne({ userId });

      if (!companyProfile) {
        return sendNotFoundResponse(res, ERROR.NOT_FOUND('Company profile'));
      }


      let subscription = await this._companySubscriptionRepository.findActiveByCompanyId(companyProfile.id);

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
            } as unknown as CreateInput<CompanySubscription>);
          }
        }
      }

      // If we still don't have a subscription after trying to find/create default
      if (!subscription) {
        return sendForbiddenResponse(res, SUBSCRIPTION.NO_ACTIVE_SUBSCRIPTION);
      }


      const plan = await this._subscriptionPlanRepository.findById(subscription.planId);
      const applicantAccessLimit = plan?.applicantAccessLimit || subscription.applicantAccessLimit || -1;

      if (!subscription.canViewCandidate(applicantAccessLimit)) {
        return sendForbiddenResponse(res, SUBSCRIPTION.LIMIT_EXCEEDED(applicantAccessLimit, 'candidate view'), {
          limitExceeded: true,

          currentLimit: applicantAccessLimit,
          used: subscription.applicantAccessUsed,
        });
      }

      await this._companySubscriptionRepository.incrementApplicantAccessUsed(subscription.id);

      (req as AuthenticatedRequest & { subscription: typeof subscription }).subscription = subscription;

      next();
    } catch (error) {
      next(error);
    }
  };
}


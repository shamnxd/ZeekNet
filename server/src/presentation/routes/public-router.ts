import { Router } from 'express';
import { publicJobController, publicDataController } from 'src/infrastructure/di/publicDi';
import { APP_ROUTES } from 'src/shared/constants/routes';

import { optionalAuthentication } from 'src/presentation/middleware/auth.middleware';

export class PublicRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.get(APP_ROUTES.PUBLIC.JOBS, publicJobController.getAllJobPostings);
    this.router.get(APP_ROUTES.PUBLIC.JOB_DETAIL, optionalAuthentication, publicJobController.getJobPosting);
    this.router.get(APP_ROUTES.PUBLIC.FEATURED_JOBS, publicJobController.getFeaturedJobs);

    this.router.get(APP_ROUTES.PUBLIC.SKILLS, publicDataController.getAllSkills);
    this.router.get(APP_ROUTES.PUBLIC.JOB_CATEGORIES, publicDataController.getAllJobCategories);
    this.router.get(APP_ROUTES.PUBLIC.JOB_ROLES, publicDataController.getAllJobRoles);
    this.router.get(APP_ROUTES.PUBLIC.COMPANIES, publicDataController.getAllCompanies);
    this.router.get(APP_ROUTES.PUBLIC.COMPANY_DETAIL, publicDataController.getCompanyProfile);
  }
}



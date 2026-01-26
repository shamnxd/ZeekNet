import { Router } from 'express';
import { publicJobController, publicDataController } from 'src/infrastructure/di/publicDi';

import { optionalAuthentication } from 'src/presentation/middleware/auth.middleware';

export class PublicRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.get('/jobs', publicJobController.getAllJobPostings);
    this.router.get('/jobs/:id', optionalAuthentication, publicJobController.getJobPosting);
    this.router.get('/featured-jobs', publicJobController.getFeaturedJobs);

    this.router.get('/skills', publicDataController.getAllSkills);
    this.router.get('/job-categories', publicDataController.getAllJobCategories);
    this.router.get('/job-roles', publicDataController.getAllJobRoles);
    this.router.get('/companies', publicDataController.getAllCompanies);
    this.router.get('/companies/:id', publicDataController.getCompanyProfile);
  }
}


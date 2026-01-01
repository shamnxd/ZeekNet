import { Router } from 'express';
import { publicJobController, publicDataController } from 'src/infrastructure/di/publicDi';

import { validateQuery } from 'src/presentation/middleware/validation.middleware';
import { optionalAuthentication } from 'src/presentation/middleware/auth.middleware';
import { JobPostingQueryDto } from 'src/application/dtos/admin/job/requests/get-job-postings-query.dto';

export class PublicRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.get('/jobs', validateQuery(JobPostingQueryDto), publicJobController.getAllJobPostings);
    this.router.get('/jobs/:id', optionalAuthentication, publicJobController.getJobPosting);

    this.router.get('/skills', publicDataController.getAllSkills);
    this.router.get('/job-categories', publicDataController.getAllJobCategories);
    this.router.get('/job-roles', publicDataController.getAllJobRoles);
    this.router.get('/companies', publicDataController.getAllCompanies);
    this.router.get('/companies/:id', publicDataController.getCompanyProfile);
    this.router.get('/companies/:id/jobs', publicDataController.getCompanyJobs);
  }
}


import { Router } from 'express';
import { publicJobController, publicDataController } from '../../infrastructure/di/publicDi';

import { validateQuery } from '../middleware/validation.middleware';
import { optionalAuthentication } from '../middleware/auth.middleware';
import { JobPostingQueryDto } from '../../application/dto/job-posting/get-job-postings-query.dto';

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
  }
}
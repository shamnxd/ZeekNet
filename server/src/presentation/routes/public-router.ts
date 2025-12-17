import { Router } from 'express';
import { publicJobController, publicDataController } from '../../infrastructure/di/publicDi';
import { PublicRoutes } from '../../domain/enums/routes.enum';
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
    this.router.get(PublicRoutes.JOBS, validateQuery(JobPostingQueryDto), publicJobController.getAllJobPostings);
    this.router.get(PublicRoutes.JOBS_ID, optionalAuthentication, publicJobController.getJobPosting);

    this.router.get(PublicRoutes.SKILLS, publicDataController.getAllSkills);
    this.router.get(PublicRoutes.JOB_CATEGORIES, publicDataController.getAllJobCategories);
    this.router.get(PublicRoutes.JOB_ROLES, publicDataController.getAllJobRoles);
  }
}
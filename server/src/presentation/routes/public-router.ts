import { Router } from 'express';
import { publicJobController, publicDataController } from '../../infrastructure/di/publicDi';
import { validateQuery } from '../middleware/validation.middleware';
import { JobPostingQueryDto } from '../../application/dto/job-posting/job-posting.dto';
import { GetAllSkillsDto } from '../../application/dto/admin/skill-management.dto';
import { GetAllJobRolesDto } from '../../application/dto/admin/job-role-management.dto';

export class PublicRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.get('/jobs', validateQuery(JobPostingQueryDto), publicJobController.getAllJobPostings);
    this.router.get('/jobs/:id', publicJobController.getJobPosting);

    this.router.get('/skills', validateQuery(GetAllSkillsDto), publicDataController.getAllSkills);
    this.router.get('/job-categories', publicDataController.getAllJobCategories);
    this.router.get('/job-roles', validateQuery(GetAllJobRolesDto), publicDataController.getAllJobRoles);
  }
}
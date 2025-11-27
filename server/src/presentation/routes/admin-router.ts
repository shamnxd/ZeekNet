import { Router } from 'express';
import { adminController, adminJobController, adminJobCategoryController, adminSkillController, adminJobRoleController, adminSubscriptionPlanController } from '../../infrastructure/di/adminDi';
import { requireAdmin } from '../middleware/admin.middleware';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateQuery, validateBody } from '../middleware/validation.middleware';
import { GetAllUsersDto, BlockUserDto } from '../../application/dto/admin/user-management.dto';
import { AdminGetAllJobsDto } from '../../application/dto/admin/admin-job.dto';
import { GetAllJobCategoriesDto, CreateJobCategoryDto, UpdateJobCategoryDto } from '../../application/dto/admin/job-category.dto';
import { GetAllSkillsDto, CreateSkillDto, UpdateSkillDto } from '../../application/dto/admin/skill-management.dto';
import { GetAllJobRolesDto, CreateJobRoleDto, UpdateJobRoleDto } from '../../application/dto/admin/job-role-management.dto';
import { GetAllSubscriptionPlansDto, CreateSubscriptionPlanDto, UpdateSubscriptionPlanDto } from '../../application/dto/admin/subscription-plan-management.dto';

export class AdminRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.use(authenticateToken);
    this.router.use(requireAdmin);

    this.router.get('/users', validateQuery(GetAllUsersDto), adminController.getAllUsers);
    this.router.patch('/users/block', validateBody(BlockUserDto), adminController.blockUser);
    this.router.get('/users/:id', adminController.getUserById);

    this.router.get('/companies', adminController.getAllCompanies);
    this.router.get('/companies/verification', adminController.getPendingCompanies);
    this.router.patch('/companies/verify', adminController.verifyCompany);

    this.router.get('/jobs', validateQuery(AdminGetAllJobsDto), adminJobController.getAllJobs);
    this.router.get('/jobs/stats', adminJobController.getJobStats);
    this.router.get('/jobs/:id', adminJobController.getJobById);
    this.router.patch('/jobs/:id/status', adminJobController.updateJobStatus);
    this.router.delete('/jobs/:id', adminJobController.deleteJob);

    this.router.get('/job-categories', validateQuery(GetAllJobCategoriesDto), adminJobCategoryController.getAllJobCategories);
    this.router.post('/job-categories', validateBody(CreateJobCategoryDto), adminJobCategoryController.createJobCategory);
    this.router.get('/job-categories/:id', adminJobCategoryController.getJobCategoryById);
    this.router.put('/job-categories/:id', validateBody(UpdateJobCategoryDto), adminJobCategoryController.updateJobCategory);
    this.router.delete('/job-categories/:id', adminJobCategoryController.deleteJobCategory);

    this.router.get('/skills', validateQuery(GetAllSkillsDto), adminSkillController.getAllSkills);
    this.router.post('/skills', validateBody(CreateSkillDto), adminSkillController.createSkill);
    this.router.get('/skills/:id', adminSkillController.getSkillById);
    this.router.put('/skills/:id', validateBody(UpdateSkillDto), adminSkillController.updateSkill);
    this.router.delete('/skills/:id', adminSkillController.deleteSkill);

    this.router.get('/job-roles', validateQuery(GetAllJobRolesDto), adminJobRoleController.getAllJobRoles);
    this.router.post('/job-roles', validateBody(CreateJobRoleDto), adminJobRoleController.createJobRole);
    this.router.get('/job-roles/:id', adminJobRoleController.getJobRoleById);
    this.router.put('/job-roles/:id', validateBody(UpdateJobRoleDto), adminJobRoleController.updateJobRole);
    this.router.delete('/job-roles/:id', adminJobRoleController.deleteJobRole);

    this.router.get('/subscription-plans', validateQuery(GetAllSubscriptionPlansDto), adminSubscriptionPlanController.getAllSubscriptionPlans);
    this.router.post('/subscription-plans', validateBody(CreateSubscriptionPlanDto), adminSubscriptionPlanController.createSubscriptionPlan);
    this.router.get('/subscription-plans/:id', adminSubscriptionPlanController.getSubscriptionPlanById);
    this.router.put('/subscription-plans/:id', validateBody(UpdateSubscriptionPlanDto), adminSubscriptionPlanController.updateSubscriptionPlan);
    this.router.delete('/subscription-plans/:id', adminSubscriptionPlanController.deleteSubscriptionPlan);
  }
}
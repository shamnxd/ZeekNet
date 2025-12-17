import { Router, RequestHandler } from 'express';
import { adminController, adminJobController, adminJobCategoryController, adminSkillController, adminJobRoleController, adminSubscriptionPlanController, adminPaymentOrderController } from '../../infrastructure/di/adminDi';

import { requireAdmin } from '../middleware/admin.middleware';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateQuery, validateBody } from '../middleware/validation.middleware';
import { GetAllUsersDto } from '../../application/dto/admin/get-all-users-query.dto';
import { GetAllJobsQueryDto } from '../../application/dto/admin/get-all-jobs-query.dto';
import { GetAllJobCategoriesDto } from '../../application/dto/admin/get-all-job-categories-query.dto';
import { CreateJobCategoryDto } from '../../application/dto/admin/create-job-category-request.dto';
import { UpdateJobCategoryDto } from '../../application/dto/admin/update-job-category-request.dto';
import { GetAllSkillsDto } from '../../application/dto/admin/get-all-skills-query.dto';
import { CreateSkillDto } from '../../application/dto/admin/create-skill-request.dto';
import { UpdateSkillDto } from '../../application/dto/admin/update-skill-request.dto';
import { GetAllJobRolesDto } from '../../application/dto/admin/get-all-job-roles-query.dto';
import { CreateJobRoleDto } from '../../application/dto/admin/create-job-role-request.dto';
import { UpdateJobRoleDto } from '../../application/dto/admin/update-job-role-request.dto';
import { GetAllSubscriptionPlansDto } from '../../application/dto/admin/get-all-subscription-plans-query.dto';
import { CreateSubscriptionPlanDto } from '../../application/dto/admin/create-subscription-plan-request.dto';
import { UpdateSubscriptionPlanDto } from '../../application/dto/admin/update-subscription-plan-request.dto';
import { MigratePlanSubscribersDto } from '../../application/dto/admin/migrate-plan-subscribers-request.dto';

export class AdminRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.use(authenticateToken);
    this.router.use(requireAdmin as RequestHandler);

    this.router.get('/users', validateQuery(GetAllUsersDto), adminController.getAllUsers);
    this.router.patch('/users/block', adminController.blockUser);
    this.router.get('/users/:id', adminController.getUserById);

    this.router.get('/companies', adminController.getAllCompanies);
    this.router.get('/companies/verification', adminController.getPendingCompanies);
    this.router.patch('/companies/verify', adminController.verifyCompany);

    this.router.get('/jobs', validateQuery(GetAllJobsQueryDto), adminJobController.getAllJobs);
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
    this.router.post('/subscription-plans/:id/migrate-subscribers', validateBody(MigratePlanSubscribersDto), adminSubscriptionPlanController.migratePlanSubscribers);

    this.router.get('/payment-orders', adminPaymentOrderController.getAllPaymentOrders);
  }
}
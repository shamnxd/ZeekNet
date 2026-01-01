import { Router, RequestHandler } from 'express';
import { adminController, adminJobController, adminJobCategoryController, adminSkillController, adminJobRoleController, adminSubscriptionPlanController, adminPaymentOrderController } from 'src/infrastructure/di/adminDi';

import { requireAdmin } from 'src/presentation/middleware/admin.middleware';
import { authenticateToken } from 'src/presentation/middleware/auth.middleware';
import { validateQuery, validateBody } from 'src/presentation/middleware/validation.middleware';
import { GetAllUsersDto } from 'src/application/dtos/admin/user/requests/get-all-users-query.dto';
import { GetAllJobsQueryDto } from 'src/application/dtos/admin/job/requests/get-all-jobs-query.dto';
import { GetAllJobCategoriesDto } from 'src/application/dtos/admin/attributes/job-categorys/requests/get-all-job-categories-query.dto';
import { CreateJobCategoryDto } from 'src/application/dtos/admin/attributes/job-categorys/requests/create-job-category-request.dto';
import { UpdateJobCategoryDto } from 'src/application/dtos/admin/attributes/job-categorys/requests/update-job-category-request.dto';
import { GetAllSkillsDto } from 'src/application/dtos/admin/attributes/skills/requests/get-all-skills-query.dto';
import { CreateSkillDto } from 'src/application/dtos/admin/attributes/skills/requests/create-skill-request.dto';
import { UpdateSkillDto } from 'src/application/dtos/admin/attributes/skills/requests/update-skill-request.dto';
import { GetAllJobRolesDto } from 'src/application/dtos/admin/attributes/job-roles/requests/get-all-job-roles-query.dto';
import { CreateJobRoleDto } from 'src/application/dtos/admin/attributes/job-roles/requests/create-job-role-request.dto';
import { UpdateJobRoleDto } from 'src/application/dtos/admin/attributes/job-roles/requests/update-job-role-request.dto';
import { GetAllSubscriptionPlansDto } from 'src/application/dtos/admin/subscription/requests/get-all-subscription-plans-query.dto';
import { CreateSubscriptionPlanDto } from 'src/application/dtos/admin/subscription/requests/create-subscription-plan-request.dto';
import { UpdateSubscriptionPlanDto } from 'src/application/dtos/admin/subscription/requests/update-subscription-plan-request.dto';
import { MigratePlanSubscribersDto } from 'src/application/dtos/admin/subscription/requests/migrate-plan-subscribers-request.dto';

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

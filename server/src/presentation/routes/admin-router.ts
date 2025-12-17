import { Router, RequestHandler } from 'express';
import { adminController, adminJobController, adminJobCategoryController, adminSkillController, adminJobRoleController, adminSubscriptionPlanController, adminPaymentOrderController } from '../../infrastructure/di/adminDi';
import { AdminRoutes } from '../../domain/enums/routes.enum';
import { requireAdmin } from '../middleware/admin.middleware';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateQuery, validateBody } from '../middleware/validation.middleware';
import { GetAllUsersDto } from '../../application/dto/admin/get-all-users-query.dto';
import { AdminGetAllJobsDto } from '../../application/dto/admin/get-all-jobs-query.dto';
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

    this.router.get(AdminRoutes.USERS, validateQuery(GetAllUsersDto), adminController.getAllUsers);
    this.router.patch(AdminRoutes.USERS_BLOCK, adminController.blockUser);
    this.router.get(AdminRoutes.USERS_ID, adminController.getUserById);

    this.router.get(AdminRoutes.COMPANIES, adminController.getAllCompanies);
    this.router.get(AdminRoutes.COMPANIES_VERIFICATION, adminController.getPendingCompanies);
    this.router.patch(AdminRoutes.COMPANIES_VERIFY, adminController.verifyCompany);

    this.router.get(AdminRoutes.JOBS, validateQuery(AdminGetAllJobsDto), adminJobController.getAllJobs);
    this.router.get(AdminRoutes.JOBS_STATS, adminJobController.getJobStats);
    this.router.get(AdminRoutes.JOBS_ID, adminJobController.getJobById);
    this.router.patch(AdminRoutes.JOBS_ID_STATUS, adminJobController.updateJobStatus);
    this.router.delete(AdminRoutes.JOBS_ID, adminJobController.deleteJob);

    this.router.get(AdminRoutes.JOB_CATEGORIES, validateQuery(GetAllJobCategoriesDto), adminJobCategoryController.getAllJobCategories);
    this.router.post(AdminRoutes.JOB_CATEGORIES, validateBody(CreateJobCategoryDto), adminJobCategoryController.createJobCategory);
    this.router.get(AdminRoutes.JOB_CATEGORIES_ID, adminJobCategoryController.getJobCategoryById);
    this.router.put(AdminRoutes.JOB_CATEGORIES_ID, validateBody(UpdateJobCategoryDto), adminJobCategoryController.updateJobCategory);
    this.router.delete(AdminRoutes.JOB_CATEGORIES_ID, adminJobCategoryController.deleteJobCategory);

    this.router.get(AdminRoutes.SKILLS, validateQuery(GetAllSkillsDto), adminSkillController.getAllSkills);
    this.router.post(AdminRoutes.SKILLS, validateBody(CreateSkillDto), adminSkillController.createSkill);
    this.router.get(AdminRoutes.SKILLS_ID, adminSkillController.getSkillById);
    this.router.put(AdminRoutes.SKILLS_ID, validateBody(UpdateSkillDto), adminSkillController.updateSkill);
    this.router.delete(AdminRoutes.SKILLS_ID, adminSkillController.deleteSkill);

    this.router.get(AdminRoutes.JOB_ROLES, validateQuery(GetAllJobRolesDto), adminJobRoleController.getAllJobRoles);
    this.router.post(AdminRoutes.JOB_ROLES, validateBody(CreateJobRoleDto), adminJobRoleController.createJobRole);
    this.router.get(AdminRoutes.JOB_ROLES_ID, adminJobRoleController.getJobRoleById);
    this.router.put(AdminRoutes.JOB_ROLES_ID, validateBody(UpdateJobRoleDto), adminJobRoleController.updateJobRole);
    this.router.delete(AdminRoutes.JOB_ROLES_ID, adminJobRoleController.deleteJobRole);

    this.router.get(AdminRoutes.SUBSCRIPTION_PLANS, validateQuery(GetAllSubscriptionPlansDto), adminSubscriptionPlanController.getAllSubscriptionPlans);
    this.router.post(AdminRoutes.SUBSCRIPTION_PLANS, validateBody(CreateSubscriptionPlanDto), adminSubscriptionPlanController.createSubscriptionPlan);
    this.router.get(AdminRoutes.SUBSCRIPTION_PLANS_ID, adminSubscriptionPlanController.getSubscriptionPlanById);
    this.router.put(AdminRoutes.SUBSCRIPTION_PLANS_ID, validateBody(UpdateSubscriptionPlanDto), adminSubscriptionPlanController.updateSubscriptionPlan);
    this.router.post(AdminRoutes.SUBSCRIPTION_PLANS_MIGRATE, validateBody(MigratePlanSubscribersDto), adminSubscriptionPlanController.migratePlanSubscribers);

    this.router.get(AdminRoutes.PAYMENT_ORDERS, adminPaymentOrderController.getAllPaymentOrders);
  }
}
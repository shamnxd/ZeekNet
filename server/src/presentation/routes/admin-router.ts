import { Router, RequestHandler } from 'express';
import { container } from 'src/infrastructure/di/container';
import { TYPES } from 'src/shared/constants/types';
import { APP_ROUTES } from 'src/shared/constants/routes';
import { requireAdmin } from 'src/presentation/middleware/admin.middleware';
import { authenticateToken } from 'src/presentation/middleware/auth.middleware';
import { AdminUserController } from 'src/presentation/controllers/admin/admin-user.controller';
import { AdminCompanyController } from 'src/presentation/controllers/admin/admin-company.controller';
import { AdminJobController } from 'src/presentation/controllers/admin/admin-job.controller';
import { AdminJobCategoryController } from 'src/presentation/controllers/admin/admin-job-category.controller';
import { AdminSkillController } from 'src/presentation/controllers/admin/admin-skill.controller';
import { AdminJobRoleController } from 'src/presentation/controllers/admin/admin-job-role.controller';
import { AdminSubscriptionPlanController } from 'src/presentation/controllers/admin/admin-subscription-plan.controller';
import { AdminPaymentOrderController } from 'src/presentation/controllers/admin/admin-payment-order.controller';
import { AdminDashboardController } from 'src/presentation/controllers/admin/admin-dashboard.controller';

export class AdminRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    const adminUserController = container.get<AdminUserController>(TYPES.AdminUserController);
    const adminCompanyController = container.get<AdminCompanyController>(TYPES.AdminCompanyController);
    const adminJobController = container.get<AdminJobController>(TYPES.AdminJobController);
    const adminJobCategoryController = container.get<AdminJobCategoryController>(TYPES.AdminJobCategoryController);
    const adminSkillController = container.get<AdminSkillController>(TYPES.AdminSkillController);
    const adminJobRoleController = container.get<AdminJobRoleController>(TYPES.AdminJobRoleController);
    const adminSubscriptionPlanController = container.get<AdminSubscriptionPlanController>(TYPES.AdminSubscriptionPlanController);
    const adminPaymentOrderController = container.get<AdminPaymentOrderController>(TYPES.AdminPaymentOrderController);
    const adminDashboardController = container.get<AdminDashboardController>(TYPES.AdminDashboardController);

    this.router.use(authenticateToken);
    this.router.use(requireAdmin as RequestHandler);

    this.router.get(APP_ROUTES.ADMIN.USERS, adminUserController.getAllUsers);
    this.router.patch(APP_ROUTES.ADMIN.BLOCK_USER, adminUserController.blockUser);
    this.router.get(APP_ROUTES.ADMIN.USER_BY_ID, adminUserController.getUserById);

    this.router.get(APP_ROUTES.ADMIN.DASHBOARD_STATS, adminDashboardController.getDashboardStats);

    this.router.get(APP_ROUTES.ADMIN.COMPANIES, adminCompanyController.getAllCompanies);
    this.router.get(APP_ROUTES.ADMIN.VERIFICATION_COMPANIES, adminCompanyController.getPendingCompanies);
    this.router.get(APP_ROUTES.ADMIN.COMPANY_BY_ID, adminCompanyController.getCompanyById);
    this.router.patch(APP_ROUTES.ADMIN.VERIFY_COMPANY, adminCompanyController.verifyCompany);

    this.router.get(APP_ROUTES.ADMIN.JOBS, adminJobController.getAllJobs);
    this.router.get(APP_ROUTES.ADMIN.JOB_STATS, adminJobController.getJobStats);
    this.router.get(APP_ROUTES.ADMIN.JOB_BY_ID, adminJobController.getJobById);
    this.router.patch(APP_ROUTES.ADMIN.JOB_STATUS, adminJobController.updateJobStatus);
    this.router.delete(APP_ROUTES.ADMIN.JOB_BY_ID, adminJobController.deleteJob);

    this.router.get(APP_ROUTES.ADMIN.JOB_CATEGORIES, adminJobCategoryController.getAllJobCategories);
    this.router.post(APP_ROUTES.ADMIN.JOB_CATEGORIES, adminJobCategoryController.createJobCategory);
    this.router.get(APP_ROUTES.ADMIN.JOB_CATEGORY_BY_ID, adminJobCategoryController.getJobCategoryById);
    this.router.put(APP_ROUTES.ADMIN.JOB_CATEGORY_BY_ID, adminJobCategoryController.updateJobCategory);
    this.router.delete(APP_ROUTES.ADMIN.JOB_CATEGORY_BY_ID, adminJobCategoryController.deleteJobCategory);

    this.router.get(APP_ROUTES.ADMIN.SKILLS, adminSkillController.getAllSkills);
    this.router.post(APP_ROUTES.ADMIN.SKILLS, adminSkillController.createSkill);
    this.router.get(APP_ROUTES.ADMIN.SKILL_BY_ID, adminSkillController.getSkillById);
    this.router.put(APP_ROUTES.ADMIN.SKILL_BY_ID, adminSkillController.updateSkill);
    this.router.delete(APP_ROUTES.ADMIN.SKILL_BY_ID, adminSkillController.deleteSkill);

    this.router.get(APP_ROUTES.ADMIN.JOB_ROLES, adminJobRoleController.getAllJobRoles);
    this.router.post(APP_ROUTES.ADMIN.JOB_ROLES, adminJobRoleController.createJobRole);
    this.router.get(APP_ROUTES.ADMIN.JOB_ROLE_BY_ID, adminJobRoleController.getJobRoleById);
    this.router.put(APP_ROUTES.ADMIN.JOB_ROLE_BY_ID, adminJobRoleController.updateJobRole);
    this.router.delete(APP_ROUTES.ADMIN.JOB_ROLE_BY_ID, adminJobRoleController.deleteJobRole);

    this.router.get(APP_ROUTES.ADMIN.SUBSCRIPTION_PLANS, adminSubscriptionPlanController.getAllSubscriptionPlans);
    this.router.post(APP_ROUTES.ADMIN.SUBSCRIPTION_PLANS, adminSubscriptionPlanController.createSubscriptionPlan);
    this.router.get(APP_ROUTES.ADMIN.SUBSCRIPTION_PLAN_BY_ID, adminSubscriptionPlanController.getSubscriptionPlanById);
    this.router.put(APP_ROUTES.ADMIN.SUBSCRIPTION_PLAN_BY_ID, adminSubscriptionPlanController.updateSubscriptionPlan);

    this.router.get(APP_ROUTES.ADMIN.PAYMENT_ORDERS, adminPaymentOrderController.getAllPaymentOrders);
  }
}


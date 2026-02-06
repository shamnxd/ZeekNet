import { Router, RequestHandler } from 'express';
import { adminUserController, adminCompanyController, adminJobController, adminJobCategoryController, adminSkillController, adminJobRoleController, adminSubscriptionPlanController, adminPaymentOrderController, adminDashboardController } from 'src/infrastructure/di/adminDi';

import { requireAdmin } from 'src/presentation/middleware/admin.middleware';
import { authenticateToken } from 'src/presentation/middleware/auth.middleware';

export class AdminRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.use(authenticateToken);
    this.router.use(requireAdmin as RequestHandler);

    this.router.get('/users', adminUserController.getAllUsers);
    this.router.patch('/users/block', adminUserController.blockUser);
    this.router.get('/users/:id', adminUserController.getUserById);

    this.router.get('/dashboard/stats', adminDashboardController.getDashboardStats);

    this.router.get('/companies', adminCompanyController.getAllCompanies);
    this.router.get('/companies/verification', adminCompanyController.getPendingCompanies);
    this.router.get('/companies/:id', adminCompanyController.getCompanyById);
    this.router.patch('/companies/verify', adminCompanyController.verifyCompany);

    this.router.get('/jobs', adminJobController.getAllJobs);
    this.router.get('/jobs/stats', adminJobController.getJobStats);
    this.router.get('/jobs/:id', adminJobController.getJobById);
    this.router.patch('/jobs/:id/status', adminJobController.updateJobStatus);
    this.router.delete('/jobs/:id', adminJobController.deleteJob);

    this.router.get('/job-categories', adminJobCategoryController.getAllJobCategories);
    this.router.post('/job-categories', adminJobCategoryController.createJobCategory);
    this.router.get('/job-categories/:id', adminJobCategoryController.getJobCategoryById);
    this.router.put('/job-categories/:id', adminJobCategoryController.updateJobCategory);
    this.router.delete('/job-categories/:id', adminJobCategoryController.deleteJobCategory);

    this.router.get('/skills', adminSkillController.getAllSkills);
    this.router.post('/skills', adminSkillController.createSkill);
    this.router.get('/skills/:id', adminSkillController.getSkillById);
    this.router.put('/skills/:id', adminSkillController.updateSkill);
    this.router.delete('/skills/:id', adminSkillController.deleteSkill);

    this.router.get('/job-roles', adminJobRoleController.getAllJobRoles);
    this.router.post('/job-roles', adminJobRoleController.createJobRole);
    this.router.get('/job-roles/:id', adminJobRoleController.getJobRoleById);
    this.router.put('/job-roles/:id', adminJobRoleController.updateJobRole);
    this.router.delete('/job-roles/:id', adminJobRoleController.deleteJobRole);

    this.router.get('/subscription-plans', adminSubscriptionPlanController.getAllSubscriptionPlans);
    this.router.post('/subscription-plans', adminSubscriptionPlanController.createSubscriptionPlan);
    this.router.get('/subscription-plans/:id', adminSubscriptionPlanController.getSubscriptionPlanById);
    this.router.put('/subscription-plans/:id', adminSubscriptionPlanController.updateSubscriptionPlan);

    this.router.get('/payment-orders', adminPaymentOrderController.getAllPaymentOrders);
  }
}

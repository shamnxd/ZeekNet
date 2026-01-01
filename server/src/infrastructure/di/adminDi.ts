import { UserRepository } from 'src/infrastructure/persistence/mongodb/repositories/user.repository';
import { CompanyProfileRepository } from 'src/infrastructure/persistence/mongodb/repositories/company-profile.repository';
import { CompanyVerificationRepository } from 'src/infrastructure/persistence/mongodb/repositories/company-verification.repository';
import { JobPostingRepository } from 'src/infrastructure/persistence/mongodb/repositories/job-posting.repository';
import { JobCategoryRepository } from 'src/infrastructure/persistence/mongodb/repositories/job-category.repository';
import { SkillRepository } from 'src/infrastructure/persistence/mongodb/repositories/skill.repository';
import { JobRoleRepository } from 'src/infrastructure/persistence/mongodb/repositories/job-role.repository';
import { SubscriptionPlanRepository } from 'src/infrastructure/persistence/mongodb/repositories/subscription-plan.repository';
import { CompanySubscriptionRepository } from 'src/infrastructure/persistence/mongodb/repositories/company-subscription.repository';
import { PaymentOrderRepository } from 'src/infrastructure/persistence/mongodb/repositories/payment-order.repository';
import { PriceHistoryRepository } from 'src/infrastructure/persistence/mongodb/repositories/price-history.repository';
import { stripeService } from 'src/infrastructure/di/companyDi';
import { GetAllUsersUseCase } from 'src/application/use-cases/admin/user/get-all-users.use-case';
import { BlockUserUseCase } from 'src/application/use-cases/admin/user/block-user.use-case';
import { GetUserByIdUseCase } from 'src/application/use-cases/admin/user/get-user-by-id.use-case';
import { GetCompaniesWithVerificationUseCase } from 'src/application/use-cases/admin/companies/get-companies-with-verification.use-case';
import { S3Service } from 'src/infrastructure/external-services/s3/s3.service';
import { VerifyCompanyUseCase } from 'src/application/use-cases/admin/companies/verify-company.use-case';
import { GetAllJobsUseCase } from 'src/application/use-cases/admin/job/get-all-jobs.use-case';
import { AdminGetJobByIdUseCase } from 'src/application/use-cases/admin/job/get-job-by-id.use-case';
import { AdminUpdateJobStatusUseCase } from 'src/application/use-cases/admin/job/update-job-status.use-case';
import { AdminDeleteJobUseCase } from 'src/application/use-cases/admin/job/delete-job.use-case';
import { AdminGetJobStatsUseCase } from 'src/application/use-cases/admin/analytics/get-job-stats.use-case';
import { CreateJobCategoryUseCase } from 'src/application/use-cases/admin/attributes/job-categorys/create-job-category.use-case';
import { GetAllJobCategoriesUseCase } from 'src/application/use-cases/admin/attributes/job-categorys/get-all-job-categories.use-case';
import { GetJobCategoryByIdUseCase } from 'src/application/use-cases/admin/attributes/job-categorys/get-job-category-by-id.use-case';
import { UpdateJobCategoryUseCase } from 'src/application/use-cases/admin/attributes/job-categorys/update-job-category.use-case';
import { DeleteJobCategoryUseCase } from 'src/application/use-cases/admin/attributes/job-categorys/delete-job-category.use-case';
import { CreateSkillUseCase } from 'src/application/use-cases/admin/attributes/skills/create-skill.use-case';
import { GetAllSkillsUseCase } from 'src/application/use-cases/admin/attributes/skills/get-all-skills.use-case';
import { GetSkillByIdUseCase } from 'src/application/use-cases/admin/attributes/skills/get-skill-by-id.use-case';
import { UpdateSkillUseCase } from 'src/application/use-cases/admin/attributes/skills/update-skill.use-case';
import { DeleteSkillUseCase } from 'src/application/use-cases/admin/attributes/skills/delete-skill.use-case';
import { CreateJobRoleUseCase } from 'src/application/use-cases/admin/attributes/job-roles/create-job-role.use-case';
import { GetAllJobRolesUseCase } from 'src/application/use-cases/admin/attributes/job-roles/get-all-job-roles.use-case';
import { GetJobRoleByIdUseCase } from 'src/application/use-cases/admin/attributes/job-roles/get-job-role-by-id.use-case';
import { UpdateJobRoleUseCase } from 'src/application/use-cases/admin/attributes/job-roles/update-job-role.use-case';
import { DeleteJobRoleUseCase } from 'src/application/use-cases/admin/attributes/job-roles/delete-job-role.use-case';
import { CreateSubscriptionPlanUseCase } from 'src/application/use-cases/admin/subscription/create-subscription-plan.use-case';
import { GetAllSubscriptionPlansUseCase } from 'src/application/use-cases/admin/subscription/get-all-subscription-plans.use-case';
import { GetSubscriptionPlanByIdUseCase } from 'src/application/use-cases/admin/subscription/get-subscription-plan-by-id.use-case';
import { UpdateSubscriptionPlanUseCase } from 'src/application/use-cases/admin/subscription/update-subscription-plan.use-case';
import { MigratePlanSubscribersUseCase } from 'src/application/use-cases/admin/subscription/migrate-plan-subscribers.use-case';
import { GetAllPaymentOrdersUseCase } from 'src/application/use-cases/admin/payments/get-all-payment-orders.use-case';
import { NodemailerService } from 'src/infrastructure/messaging/mailer';
import { AdminController } from 'src/presentation/controllers/admin/admin.controller';
import { AdminJobController } from 'src/presentation/controllers/admin/admin-job.controller';
import { AdminJobCategoryController } from 'src/presentation/controllers/admin/admin-job-category.controller';
import { AdminSkillController } from 'src/presentation/controllers/admin/admin-skill.controller';
import { AdminJobRoleController } from 'src/presentation/controllers/admin/admin-job-role.controller';
import { AdminSubscriptionPlanController } from 'src/presentation/controllers/admin/admin-subscription-plan.controller';
import { AdminPaymentOrderController } from 'src/presentation/controllers/admin/admin-payment-order.controller';
import { GetAllCompaniesUseCase } from 'src/application/use-cases/admin/companies/get-all-companies.use-case';
import { GetPendingCompaniesUseCase } from 'src/application/use-cases/admin/companies/get-pending-companies.use-case';
import { GetCompanyByIdUseCase } from 'src/application/use-cases/admin/companies/get-company-by-id.use-case';

const userRepository = new UserRepository();
const companyProfileRepository = new CompanyProfileRepository();
const companyVerificationRepository = new CompanyVerificationRepository();
const jobPostingRepository = new JobPostingRepository();
const jobCategoryRepository = new JobCategoryRepository();
const skillRepository = new SkillRepository();
const jobRoleRepository = new JobRoleRepository();
const subscriptionPlanRepository = new SubscriptionPlanRepository();
const companySubscriptionRepository = new CompanySubscriptionRepository();
const paymentOrderRepository = new PaymentOrderRepository();
const priceHistoryRepository = new PriceHistoryRepository();

const s3Service = new S3Service();

const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);

import { notificationService } from 'src/infrastructure/di/notificationDi';





const blockUserUseCase = new BlockUserUseCase(userRepository, notificationService);

const adminGetUserByIdUseCase = new GetUserByIdUseCase(userRepository);

const getAllCompaniesUseCase = new GetAllCompaniesUseCase(companyProfileRepository, s3Service);

const getCompaniesWithVerificationUseCase = new GetCompaniesWithVerificationUseCase(companyProfileRepository, companyVerificationRepository, s3Service);

const verifyCompanyUseCase = new VerifyCompanyUseCase(companyVerificationRepository, subscriptionPlanRepository, companySubscriptionRepository);

const getPendingCompaniesUseCase = new GetPendingCompaniesUseCase(getCompaniesWithVerificationUseCase);

const getCompanyByIdUseCase = new GetCompanyByIdUseCase(getCompaniesWithVerificationUseCase);

const adminGetAllJobsUseCase = new GetAllJobsUseCase(jobPostingRepository);

const adminGetJobByIdUseCase = new AdminGetJobByIdUseCase(jobPostingRepository);

const adminUpdateJobStatusUseCase = new AdminUpdateJobStatusUseCase(jobPostingRepository);

const adminDeleteJobUseCase = new AdminDeleteJobUseCase(jobPostingRepository);

const adminGetJobStatsUseCase = new AdminGetJobStatsUseCase(jobPostingRepository);

const createJobCategoryUseCase = new CreateJobCategoryUseCase(jobCategoryRepository);
const getAllJobCategoriesUseCase = new GetAllJobCategoriesUseCase(jobCategoryRepository);
const getJobCategoryByIdUseCase = new GetJobCategoryByIdUseCase(jobCategoryRepository);
const updateJobCategoryUseCase = new UpdateJobCategoryUseCase(jobCategoryRepository);
const deleteJobCategoryUseCase = new DeleteJobCategoryUseCase(jobCategoryRepository);

const adminController = new AdminController(getAllUsersUseCase, blockUserUseCase, adminGetUserByIdUseCase, getAllCompaniesUseCase, getCompaniesWithVerificationUseCase, verifyCompanyUseCase, getPendingCompaniesUseCase, getCompanyByIdUseCase);

const adminJobController = new AdminJobController(adminGetAllJobsUseCase, adminGetJobByIdUseCase, adminUpdateJobStatusUseCase, adminDeleteJobUseCase, adminGetJobStatsUseCase);

const adminJobCategoryController = new AdminJobCategoryController(createJobCategoryUseCase, getAllJobCategoriesUseCase, getJobCategoryByIdUseCase, updateJobCategoryUseCase, deleteJobCategoryUseCase);

const createSkillUseCase = new CreateSkillUseCase(skillRepository);
const getAllSkillsUseCase = new GetAllSkillsUseCase(skillRepository);
const getSkillByIdUseCase = new GetSkillByIdUseCase(skillRepository);
const updateSkillUseCase = new UpdateSkillUseCase(skillRepository);
const deleteSkillUseCase = new DeleteSkillUseCase(skillRepository);

const adminSkillController = new AdminSkillController(createSkillUseCase, getAllSkillsUseCase, getSkillByIdUseCase, updateSkillUseCase, deleteSkillUseCase);

const createJobRoleUseCase = new CreateJobRoleUseCase(jobRoleRepository);
const getAllJobRolesUseCase = new GetAllJobRolesUseCase(jobRoleRepository);
const getJobRoleByIdUseCase = new GetJobRoleByIdUseCase(jobRoleRepository);
const updateJobRoleUseCase = new UpdateJobRoleUseCase(jobRoleRepository);
const deleteJobRoleUseCase = new DeleteJobRoleUseCase(jobRoleRepository);

const adminJobRoleController = new AdminJobRoleController(createJobRoleUseCase, getAllJobRolesUseCase, getJobRoleByIdUseCase, updateJobRoleUseCase, deleteJobRoleUseCase);

const createSubscriptionPlanUseCase = new CreateSubscriptionPlanUseCase(subscriptionPlanRepository, logger, stripeService, priceHistoryRepository);
const getAllSubscriptionPlansUseCase = new GetAllSubscriptionPlansUseCase(subscriptionPlanRepository);
const getSubscriptionPlanByIdUseCase = new GetSubscriptionPlanByIdUseCase(subscriptionPlanRepository);
const updateSubscriptionPlanUseCase = new UpdateSubscriptionPlanUseCase(subscriptionPlanRepository, logger, stripeService, priceHistoryRepository);
const mailerService = new NodemailerService();
import { logger } from 'src/infrastructure/config/logger';
import { EmailTemplateService } from 'src/infrastructure/services/email-template.service';

const emailTemplateService = new EmailTemplateService();


const migratePlanSubscribersUseCase = new MigratePlanSubscribersUseCase(
  subscriptionPlanRepository,
  stripeService,
  priceHistoryRepository,
  companySubscriptionRepository,
  mailerService,
  logger,
  emailTemplateService,
);

const adminSubscriptionPlanController = new AdminSubscriptionPlanController(
  createSubscriptionPlanUseCase,
  getAllSubscriptionPlansUseCase,
  getSubscriptionPlanByIdUseCase,
  updateSubscriptionPlanUseCase,
  migratePlanSubscribersUseCase,
);

const getAllPaymentOrdersUseCase = new GetAllPaymentOrdersUseCase(paymentOrderRepository, companyProfileRepository, subscriptionPlanRepository);

const adminPaymentOrderController = new AdminPaymentOrderController(getAllPaymentOrdersUseCase);

export {
  adminController,
  adminJobController,
  adminJobCategoryController,
  adminSkillController,
  adminJobRoleController,
  adminSubscriptionPlanController,
  adminPaymentOrderController,
};


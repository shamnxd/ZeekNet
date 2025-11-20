import { UserRepository } from '../database/mongodb/repositories/user.repository';
import { CompanyProfileRepository } from '../database/mongodb/repositories/company-profile.repository';
import { CompanyVerificationRepository } from '../database/mongodb/repositories/company-verification.repository';
import { JobPostingRepository } from '../database/mongodb/repositories/job-posting.repository';
import { JobCategoryRepository } from '../database/mongodb/repositories/job-category.repository';
import { SkillRepository } from '../database/mongodb/repositories/skill.repository';
import { JobRoleRepository } from '../database/mongodb/repositories/job-role.repository';
import { GetAllUsersUseCase } from '../../application/use-cases/admin/get-all-users.use-case';
import { BlockUserUseCase } from '../../application/use-cases/admin/block-user.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/admin/get-user-by-id.use-case';
import { GetCompaniesWithVerificationUseCase } from '../../application/use-cases/admin/get-companies-with-verification.use-case';
import { S3Service } from '../external-services/s3/s3.service';
import { VerifyCompanyUseCase } from '../../application/use-cases/admin/verify-company.use-case';
import { AdminGetAllJobsUseCase } from '../../application/use-cases/admin/get-all-jobs.use-case';
import { AdminGetJobByIdUseCase } from '../../application/use-cases/admin/get-job-by-id.use-case';
import { AdminUpdateJobStatusUseCase } from '../../application/use-cases/admin/update-job-status.use-case';
import { AdminDeleteJobUseCase } from '../../application/use-cases/admin/delete-job.use-case';
import { AdminGetJobStatsUseCase } from '../../application/use-cases/admin/get-job-stats.use-case';
import { CreateJobCategoryUseCase } from '../../application/use-cases/admin/create-job-category.use-case';
import { GetAllJobCategoriesUseCase } from '../../application/use-cases/admin/get-all-job-categories.use-case';
import { GetJobCategoryByIdUseCase } from '../../application/use-cases/admin/get-job-category-by-id.use-case';
import { UpdateJobCategoryUseCase } from '../../application/use-cases/admin/update-job-category.use-case';
import { DeleteJobCategoryUseCase } from '../../application/use-cases/admin/delete-job-category.use-case';
import { CreateSkillUseCase } from '../../application/use-cases/admin/create-skill.use-case';
import { GetAllSkillsUseCase } from '../../application/use-cases/admin/get-all-skills.use-case';
import { GetSkillByIdUseCase } from '../../application/use-cases/admin/get-skill-by-id.use-case';
import { UpdateSkillUseCase } from '../../application/use-cases/admin/update-skill.use-case';
import { DeleteSkillUseCase } from '../../application/use-cases/admin/delete-skill.use-case';
import { CreateJobRoleUseCase } from '../../application/use-cases/admin/create-job-role.use-case';
import { GetAllJobRolesUseCase } from '../../application/use-cases/admin/get-all-job-roles.use-case';
import { GetJobRoleByIdUseCase } from '../../application/use-cases/admin/get-job-role-by-id.use-case';
import { UpdateJobRoleUseCase } from '../../application/use-cases/admin/update-job-role.use-case';
import { DeleteJobRoleUseCase } from '../../application/use-cases/admin/delete-job-role.use-case';
import { AdminController } from '../../presentation/controllers/admin/admin.controller';
import { AdminJobController } from '../../presentation/controllers/admin/admin-job.controller';
import { AdminJobCategoryController } from '../../presentation/controllers/admin/admin-job-category.controller';
import { AdminSkillController } from '../../presentation/controllers/admin/admin-skill.controller';
import { AdminJobRoleController } from '../../presentation/controllers/admin/admin-job-role.controller';
import { GetAllCompaniesUseCase } from '../../application/use-cases/admin/get-all-companies.use-case';

const userRepository = new UserRepository();
const companyProfileRepository = new CompanyProfileRepository();
const companyVerificationRepository = new CompanyVerificationRepository();
const jobPostingRepository = new JobPostingRepository();
const jobCategoryRepository = new JobCategoryRepository();
const skillRepository = new SkillRepository();
const jobRoleRepository = new JobRoleRepository();

const s3Service = new S3Service();

const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);

const blockUserUseCase = new BlockUserUseCase(userRepository);

const adminGetUserByIdUseCase = new GetUserByIdUseCase(userRepository);

const getAllCompaniesUseCase = new GetAllCompaniesUseCase(companyProfileRepository);

const getCompaniesWithVerificationUseCase = new GetCompaniesWithVerificationUseCase(companyProfileRepository, companyVerificationRepository, s3Service);

const verifyCompanyUseCase = new VerifyCompanyUseCase(companyVerificationRepository);

const adminGetAllJobsUseCase = new AdminGetAllJobsUseCase(jobPostingRepository);

const adminGetJobByIdUseCase = new AdminGetJobByIdUseCase(jobPostingRepository);

const adminUpdateJobStatusUseCase = new AdminUpdateJobStatusUseCase(jobPostingRepository);

const adminDeleteJobUseCase = new AdminDeleteJobUseCase(jobPostingRepository);

const adminGetJobStatsUseCase = new AdminGetJobStatsUseCase(jobPostingRepository);

const createJobCategoryUseCase = new CreateJobCategoryUseCase(jobCategoryRepository);
const getAllJobCategoriesUseCase = new GetAllJobCategoriesUseCase(jobCategoryRepository);
const getJobCategoryByIdUseCase = new GetJobCategoryByIdUseCase(jobCategoryRepository);
const updateJobCategoryUseCase = new UpdateJobCategoryUseCase(jobCategoryRepository);
const deleteJobCategoryUseCase = new DeleteJobCategoryUseCase(jobCategoryRepository);

const adminController = new AdminController(getAllUsersUseCase, blockUserUseCase, adminGetUserByIdUseCase, getCompaniesWithVerificationUseCase, verifyCompanyUseCase);

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

export { adminController, adminJobController, adminJobCategoryController, adminSkillController, adminJobRoleController };
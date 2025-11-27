import { JobPostingRepository } from '../database/mongodb/repositories/job-posting.repository';
import { JobApplicationRepository } from '../database/mongodb/repositories/job-application.repository';
import { SkillRepository } from '../database/mongodb/repositories/skill.repository';
import { JobCategoryRepository } from '../database/mongodb/repositories/job-category.repository';
import { JobRoleRepository } from '../database/mongodb/repositories/job-role.repository';
import { GetAllJobPostingsUseCase } from '../../application/use-cases/public/get-all-job-postings.use-case';
import { GetJobPostingForPublicUseCase } from '../../application/use-cases/public/get-job-posting-for-public.use-case';
import { GetPublicSkillsUseCase } from '../../application/use-cases/public/get-public-skills.use-case';
import { GetPublicJobCategoriesUseCase } from '../../application/use-cases/public/get-public-job-categories.use-case';
import { GetPublicJobRolesUseCase } from '../../application/use-cases/public/get-public-job-roles.use-case';
import { PublicJobController } from '../../presentation/controllers/public/public-job.controller';
import { PublicDataController } from '../../presentation/controllers/public/public-data.controller';

const jobPostingRepository = new JobPostingRepository();
const jobApplicationRepository = new JobApplicationRepository();
const skillRepository = new SkillRepository();
const jobCategoryRepository = new JobCategoryRepository();
const jobRoleRepository = new JobRoleRepository();

const getAllJobPostingsUseCase = new GetAllJobPostingsUseCase(jobPostingRepository);

const getJobPostingForPublicUseCase = new GetJobPostingForPublicUseCase(jobPostingRepository, jobApplicationRepository);

const getPublicSkillsUseCase = new GetPublicSkillsUseCase(skillRepository);
const getPublicJobCategoriesUseCase = new GetPublicJobCategoriesUseCase(jobCategoryRepository);
const getPublicJobRolesUseCase = new GetPublicJobRolesUseCase(jobRoleRepository);

const publicJobController = new PublicJobController(getAllJobPostingsUseCase, getJobPostingForPublicUseCase);

const publicDataController = new PublicDataController(getPublicSkillsUseCase, getPublicJobCategoriesUseCase, getPublicJobRolesUseCase);

export { publicJobController, publicDataController };
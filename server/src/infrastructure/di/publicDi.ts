import { JobPostingRepository } from '../database/mongodb/repositories/job-posting.repository';
import { SkillRepository } from '../database/mongodb/repositories/skill.repository';
import { JobCategoryRepository } from '../database/mongodb/repositories/job-category.repository';
import { JobRoleRepository } from '../database/mongodb/repositories/job-role.repository';
import { GetAllJobPostingsUseCase } from '../../application/use-cases/public/get-all-job-postings.use-case';
import { GetJobPostingForPublicUseCase } from '../../application/use-cases/public/get-job-posting-for-public.use-case';
import { GetAllSkillsUseCase } from '../../application/use-cases/admin/get-all-skills.use-case';
import { GetAllJobCategoriesUseCase } from '../../application/use-cases/admin/get-all-job-categories.use-case';
import { GetAllJobRolesUseCase } from '../../application/use-cases/admin/get-all-job-roles.use-case';
import { PublicJobController } from '../../presentation/controllers/public/public-job.controller';
import { PublicDataController } from '../../presentation/controllers/public/public-data.controller';

const jobPostingRepository = new JobPostingRepository();
const skillRepository = new SkillRepository();
const jobCategoryRepository = new JobCategoryRepository();
const jobRoleRepository = new JobRoleRepository();

const getAllJobPostingsUseCase = new GetAllJobPostingsUseCase(jobPostingRepository);

const getJobPostingForPublicUseCase = new GetJobPostingForPublicUseCase(jobPostingRepository);

const getAllSkillsUseCase = new GetAllSkillsUseCase(skillRepository);
const getAllJobCategoriesUseCase = new GetAllJobCategoriesUseCase(jobCategoryRepository);
const getAllJobRolesUseCase = new GetAllJobRolesUseCase(jobRoleRepository);

const publicJobController = new PublicJobController(getAllJobPostingsUseCase, getJobPostingForPublicUseCase);

const publicDataController = new PublicDataController(getAllSkillsUseCase, getAllJobCategoriesUseCase, getAllJobRolesUseCase);

export { publicJobController, publicDataController };
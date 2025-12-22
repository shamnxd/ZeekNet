import { JobPostingRepository } from '../database/mongodb/repositories/job-posting.repository';
import { JobApplicationRepository } from '../database/mongodb/repositories/job-application.repository';
import { SkillRepository } from '../database/mongodb/repositories/skill.repository';
import { JobCategoryRepository } from '../database/mongodb/repositories/job-category.repository';
import { JobRoleRepository } from '../database/mongodb/repositories/job-role.repository';
import { CompanyProfileRepository } from '../database/mongodb/repositories/company-profile.repository';
import { CompanySubscriptionRepository } from '../database/mongodb/repositories/company-subscription.repository';
import { CompanyContactRepository } from '../database/mongodb/repositories/company-contact.repository';
import { CompanyOfficeLocationRepository } from '../database/mongodb/repositories/company-office-location.repository';
import { CompanyTechStackRepository } from '../database/mongodb/repositories/company-tech-stack.repository';
import { CompanyBenefitsRepository } from '../database/mongodb/repositories/company-benefits.repository';
import { CompanyWorkplacePicturesRepository } from '../database/mongodb/repositories/company-workplace-pictures.repository';
import { S3Service } from '../external-services/s3/s3.service';
import { GetAllJobPostingsUseCase } from '../../application/use-cases/public/get-all-job-postings.use-case';
import { GetJobPostingForPublicUseCase } from '../../application/use-cases/public/get-job-posting-for-public.use-case';
import { GetPublicSkillsUseCase } from '../../application/use-cases/public/get-public-skills.use-case';
import { GetPublicJobCategoriesUseCase } from '../../application/use-cases/public/get-public-job-categories.use-case';
import { GetPublicJobRolesUseCase } from '../../application/use-cases/public/get-public-job-roles.use-case';
import { GetSeekerCompaniesUseCase } from '../../application/use-cases/public/get-seeker-companies.use-case';
import { GetPublicCompanyProfileUseCase } from '../../application/use-cases/public/get-public-company-profile.use-case';
import { GetPublicCompanyJobsUseCase } from '../../application/use-cases/public/get-public-company-jobs.use-case';
import { PublicJobController } from '../../presentation/controllers/public/public-job.controller';
import { PublicDataController } from '../../presentation/controllers/public/public-data.controller';

const jobPostingRepository = new JobPostingRepository();
const jobApplicationRepository = new JobApplicationRepository();
const skillRepository = new SkillRepository();
const jobCategoryRepository = new JobCategoryRepository();
const jobRoleRepository = new JobRoleRepository();
const companyProfileRepository = new CompanyProfileRepository();
const companySubscriptionRepository = new CompanySubscriptionRepository();
const companyContactRepository = new CompanyContactRepository();
const companyOfficeLocationRepository = new CompanyOfficeLocationRepository();
const companyTechStackRepository = new CompanyTechStackRepository();
const companyBenefitsRepository = new CompanyBenefitsRepository();
const companyWorkplacePicturesRepository = new CompanyWorkplacePicturesRepository();
const s3Service = new S3Service();

const getAllJobPostingsUseCase = new GetAllJobPostingsUseCase(jobPostingRepository);

const getJobPostingForPublicUseCase = new GetJobPostingForPublicUseCase(jobPostingRepository, jobApplicationRepository, s3Service);

const getPublicSkillsUseCase = new GetPublicSkillsUseCase(skillRepository);
const getPublicJobCategoriesUseCase = new GetPublicJobCategoriesUseCase(jobCategoryRepository);
const getPublicJobRolesUseCase = new GetPublicJobRolesUseCase(jobRoleRepository);
const getSeekerCompaniesUseCase = new GetSeekerCompaniesUseCase(
  companyProfileRepository,
  jobPostingRepository,
  companySubscriptionRepository,
  s3Service,
);
const getPublicCompanyProfileUseCase = new GetPublicCompanyProfileUseCase(
  companyProfileRepository,
  jobPostingRepository,
  companySubscriptionRepository,
  companyContactRepository,
  companyOfficeLocationRepository,
  companyTechStackRepository,
  companyBenefitsRepository,
  companyWorkplacePicturesRepository,
  s3Service,
);
const getPublicCompanyJobsUseCase = new GetPublicCompanyJobsUseCase(
  companyProfileRepository,
  jobPostingRepository,
);

const publicJobController = new PublicJobController(getAllJobPostingsUseCase, getJobPostingForPublicUseCase);

const publicDataController = new PublicDataController(
  getPublicSkillsUseCase,
  getPublicJobCategoriesUseCase,
  getPublicJobRolesUseCase,
  getSeekerCompaniesUseCase,
  getPublicCompanyProfileUseCase,
  getPublicCompanyJobsUseCase,
);

export { publicJobController, publicDataController };
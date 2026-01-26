import { JobPostingRepository } from 'src/infrastructure/persistence/mongodb/repositories/job-posting.repository';
import { JobApplicationRepository } from 'src/infrastructure/persistence/mongodb/repositories/job-application.repository';
import { SkillRepository } from 'src/infrastructure/persistence/mongodb/repositories/skill.repository';
import { JobCategoryRepository } from 'src/infrastructure/persistence/mongodb/repositories/job-category.repository';
import { JobRoleRepository } from 'src/infrastructure/persistence/mongodb/repositories/job-role.repository';
import { CompanyProfileRepository } from 'src/infrastructure/persistence/mongodb/repositories/company-profile.repository';
import { CompanySubscriptionRepository } from 'src/infrastructure/persistence/mongodb/repositories/company-subscription.repository';
import { CompanyContactRepository } from 'src/infrastructure/persistence/mongodb/repositories/company-contact.repository';
import { CompanyOfficeLocationRepository } from 'src/infrastructure/persistence/mongodb/repositories/company-office-location.repository';
import { CompanyTechStackRepository } from 'src/infrastructure/persistence/mongodb/repositories/company-tech-stack.repository';
import { CompanyBenefitsRepository } from 'src/infrastructure/persistence/mongodb/repositories/company-benefits.repository';
import { CompanyWorkplacePicturesRepository } from 'src/infrastructure/persistence/mongodb/repositories/company-workplace-pictures.repository';
import { UserRepository } from 'src/infrastructure/persistence/mongodb/repositories/user.repository';
import { S3Service } from 'src/infrastructure/external-services/s3/s3.service';
import { GetAllJobPostingsUseCase } from 'src/application/use-cases/public/listings/jobs/get-all-job-postings.use-case';
import { GetJobPostingForPublicUseCase } from 'src/application/use-cases/public/listings/jobs/get-job-posting-for-public.use-case';
import { GetFeaturedJobsUseCase } from 'src/application/use-cases/public/listings/jobs/get-featured-jobs.use-case';
import { GetPublicSkillsUseCase } from 'src/application/use-cases/public/attributes/get-public-skills.use-case';
import { GetPublicJobCategoriesUseCase } from 'src/application/use-cases/public/attributes/get-public-job-categories.use-case';
import { GetPublicJobRolesUseCase } from 'src/application/use-cases/public/attributes/get-public-job-roles.use-case';
import { GetSeekerCompaniesUseCase } from 'src/application/use-cases/public/listings/companys/get-seeker-companies.use-case';
import { GetPublicCompanyProfileUseCase } from 'src/application/use-cases/public/listings/companys/get-public-company-profile.use-case';
import { PublicJobController } from 'src/presentation/controllers/public/public-job.controller';
import { PublicDataController } from 'src/presentation/controllers/public/public-data.controller';

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
const userRepository = new UserRepository();
const s3Service = new S3Service();

const getAllJobPostingsUseCase = new GetAllJobPostingsUseCase(
  jobPostingRepository,
  s3Service,
);

const getJobPostingForPublicUseCase = new GetJobPostingForPublicUseCase(
  jobPostingRepository,
  jobApplicationRepository,
  companyProfileRepository,
  userRepository,
  companyWorkplacePicturesRepository,
  s3Service,
);

const getFeaturedJobsUseCase = new GetFeaturedJobsUseCase(
  jobPostingRepository,
  s3Service,
);

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

const publicJobController = new PublicJobController(
  getAllJobPostingsUseCase,
  getJobPostingForPublicUseCase,
  getFeaturedJobsUseCase,
);

const publicDataController = new PublicDataController(
  getPublicSkillsUseCase,
  getPublicJobCategoriesUseCase,
  getPublicJobRolesUseCase,
  getSeekerCompaniesUseCase,
  getPublicCompanyProfileUseCase,
);

export { publicJobController, publicDataController };

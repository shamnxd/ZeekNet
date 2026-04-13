import { Container } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { IGetAllJobPostingsUseCase } from 'src/domain/interfaces/use-cases/public/listings/jobs/IGetAllJobPostingsUseCase';
import { IGetJobPostingForPublicUseCase } from 'src/domain/interfaces/use-cases/public/listings/jobs/IGetJobPostingForPublicUseCase';
import { IGetFeaturedJobsUseCase } from 'src/domain/interfaces/use-cases/public/listings/jobs/IGetFeaturedJobsUseCase';
import { GetAllJobPostingsUseCase } from 'src/application/use-cases/public/listings/jobs/get-all-job-postings.use-case';
import { GetJobPostingForPublicUseCase } from 'src/application/use-cases/public/listings/jobs/get-job-posting-for-public.use-case';
import { GetFeaturedJobsUseCase } from 'src/application/use-cases/public/listings/jobs/get-featured-jobs.use-case';
import { IGetPublicSkillsUseCase } from 'src/domain/interfaces/use-cases/public/attributes/IGetPublicSkillsUseCase';
import { IGetPublicJobCategoriesUseCase } from 'src/domain/interfaces/use-cases/public/attributes/IGetPublicJobCategoriesUseCase';
import { IGetPublicJobRolesUseCase } from 'src/domain/interfaces/use-cases/public/attributes/IGetPublicJobRolesUseCase';
import { IGetSeekerCompaniesUseCase } from 'src/domain/interfaces/use-cases/public/listings/companys/IGetSeekerCompaniesUseCase';
import { IGetPublicCompanyProfileUseCase } from 'src/domain/interfaces/use-cases/public/listings/companys/IGetPublicCompanyProfileUseCase';
import { GetPublicSkillsUseCase } from 'src/application/use-cases/public/attributes/get-public-skills.use-case';
import { GetPublicJobCategoriesUseCase } from 'src/application/use-cases/public/attributes/get-public-job-categories.use-case';
import { GetPublicJobRolesUseCase } from 'src/application/use-cases/public/attributes/get-public-job-roles.use-case';
import { GetSeekerCompaniesUseCase } from 'src/application/use-cases/public/listings/companys/get-seeker-companies.use-case';
import { GetPublicCompanyProfileUseCase } from 'src/application/use-cases/public/listings/companys/get-public-company-profile.use-case';
import { PublicJobController } from 'src/presentation/controllers/public/public-job.controller';
import { PublicDataController } from 'src/presentation/controllers/public/public-data.controller';

export function registerPublicDi(container: Container): void {
  container.bind<IGetAllJobPostingsUseCase>(TYPES.GetAllJobPostingsUseCase).to(GetAllJobPostingsUseCase);
  container.bind<IGetJobPostingForPublicUseCase>(TYPES.GetJobPostingForPublicUseCase).to(GetJobPostingForPublicUseCase);
  container.bind<IGetFeaturedJobsUseCase>(TYPES.GetFeaturedJobsUseCase).to(GetFeaturedJobsUseCase);
  container.bind<IGetPublicSkillsUseCase>(TYPES.GetPublicSkillsUseCase).to(GetPublicSkillsUseCase);
  container.bind<IGetPublicJobCategoriesUseCase>(TYPES.GetPublicJobCategoriesUseCase).to(GetPublicJobCategoriesUseCase);
  container.bind<IGetPublicJobRolesUseCase>(TYPES.GetPublicJobRolesUseCase).to(GetPublicJobRolesUseCase);
  container.bind<IGetSeekerCompaniesUseCase>(TYPES.GetSeekerCompaniesUseCase).to(GetSeekerCompaniesUseCase);
  container.bind<IGetPublicCompanyProfileUseCase>(TYPES.GetPublicCompanyProfileUseCase).to(GetPublicCompanyProfileUseCase);
  container.bind<PublicJobController>(TYPES.PublicJobController).to(PublicJobController);
  container.bind<PublicDataController>(TYPES.PublicDataController).to(PublicDataController);
}

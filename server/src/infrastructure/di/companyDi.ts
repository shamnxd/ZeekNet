import { CompanyProfileRepository } from '../database/mongodb/repositories/company-profile.repository';
import { CompanyContactRepository } from '../database/mongodb/repositories/company-contact.repository';
import { CompanyVerificationRepository } from '../database/mongodb/repositories/company-verification.repository';
import { CompanyTechStackRepository } from '../database/mongodb/repositories/company-tech-stack.repository';
import { CompanyOfficeLocationRepository } from '../database/mongodb/repositories/company-office-location.repository';
import { CompanyBenefitsRepository } from '../database/mongodb/repositories/company-benefits.repository';
import { CompanyWorkplacePicturesRepository } from '../database/mongodb/repositories/company-workplace-pictures.repository';
import { JobPostingRepository } from '../database/mongodb/repositories/job-posting.repository';
import { JobApplicationRepository } from '../database/mongodb/repositories/job-application.repository';
import { UserRepository } from '../database/mongodb/repositories/user.repository';
import { SeekerProfileRepository } from '../database/mongodb/repositories/seeker-profile.repository';
import { SeekerExperienceRepository } from '../database/mongodb/repositories/seeker-experience.repository';
import { SeekerEducationRepository } from '../database/mongodb/repositories/seeker-education.repository';
import { notificationRepository } from './notificationDi';
import { S3Service } from '../external-services/s3/s3.service';
import { CreateCompanyProfileUseCase } from '../../application/use-cases/company/create-company-profile.use-case';
import { CreateCompanyProfileFromDtoUseCase } from '../../application/use-cases/company/create-company-profile-from-dto.use-case';
import { UpdateCompanyProfileUseCase } from '../../application/use-cases/company/update-company-profile.use-case';
import { GetCompanyProfileUseCase } from '../../application/use-cases/company/get-company-profile.use-case';
import { GetCompanyProfileWithJobPostingsUseCase } from '../../application/use-cases/company/get-company-profile-with-job-postings.use-case';
import { GetCompanyDashboardUseCase } from '../../application/use-cases/company/get-company-dashboard.use-case';
import { ReapplyCompanyVerificationUseCase } from '../../application/use-cases/company/reapply-company-verification.use-case';
import { CompanyContactUseCase } from '../../application/use-cases/company/company-contact.use-case';
import { CreateCompanyTechStackUseCase } from '../../application/use-cases/company/create-company-tech-stack.use-case';
import { UpdateCompanyTechStackUseCase } from '../../application/use-cases/company/update-company-tech-stack.use-case';
import { DeleteCompanyTechStackUseCase } from '../../application/use-cases/company/delete-company-tech-stack.use-case';
import { GetCompanyTechStackUseCase } from '../../application/use-cases/company/get-company-tech-stack.use-case';
import { CreateCompanyOfficeLocationUseCase } from '../../application/use-cases/company/create-company-office-location.use-case';
import { UpdateCompanyOfficeLocationUseCase } from '../../application/use-cases/company/update-company-office-location.use-case';
import { DeleteCompanyOfficeLocationUseCase } from '../../application/use-cases/company/delete-company-office-location.use-case';
import { GetCompanyOfficeLocationUseCase } from '../../application/use-cases/company/get-company-office-location.use-case';
import { CreateCompanyBenefitUseCase } from '../../application/use-cases/company/create-company-benefit.use-case';
import { UpdateCompanyBenefitUseCase } from '../../application/use-cases/company/update-company-benefit.use-case';
import { DeleteCompanyBenefitUseCase } from '../../application/use-cases/company/delete-company-benefit.use-case';
import { GetCompanyBenefitUseCase } from '../../application/use-cases/company/get-company-benefit.use-case';
import { CreateCompanyWorkplacePictureUseCase } from '../../application/use-cases/company/create-company-workplace-picture.use-case';
import { UpdateCompanyWorkplacePictureUseCase } from '../../application/use-cases/company/update-company-workplace-picture.use-case';
import { DeleteCompanyWorkplacePictureUseCase } from '../../application/use-cases/company/delete-company-workplace-picture.use-case';
import { GetCompanyWorkplacePictureUseCase } from '../../application/use-cases/company/get-company-workplace-picture.use-case';
import { CreateJobPostingUseCase } from '../../application/use-cases/company/create-job-posting.use-case';
import { GetJobPostingUseCase } from '../../application/use-cases/company/get-job-posting.use-case';
import { GetCompanyJobPostingUseCase } from '../../application/use-cases/company/get-company-job-posting.use-case';
import { GetCompanyProfileByUserIdUseCase } from '../../application/use-cases/auth/get-company-profile-by-user-id.use-case';
import { GetCompanyJobPostingsUseCase } from '../../application/use-cases/company/get-company-job-postings.use-case';
import { UpdateJobPostingUseCase } from '../../application/use-cases/company/update-job-posting.use-case';
import { DeleteJobPostingUseCase } from '../../application/use-cases/company/delete-job-posting.use-case';
import { IncrementJobViewCountUseCase } from '../../application/use-cases/company/increment-job-view-count.use-case';
import { UpdateJobStatusUseCase } from '../../application/use-cases/company/update-job-status.use-case';
import { CompanyProfileController } from '../../presentation/controllers/company/company-profile.controller';
import { CompanyContactController } from '../../presentation/controllers/company/company-contact.controller';
import { CompanyTechStackController } from '../../presentation/controllers/company/company-tech-stack.controller';
import { CompanyOfficeLocationController } from '../../presentation/controllers/company/company-office-location.controller';
import { CompanyBenefitController } from '../../presentation/controllers/company/company-benefit.controller';
import { CompanyWorkplacePictureController } from '../../presentation/controllers/company/company-workplace-picture.controller';
import { CompanyUploadController } from '../../presentation/controllers/company/company-upload.controller';
import { CompanyJobPostingController } from '../../presentation/controllers/company/company-job-posting.controller';
import { CompanyJobApplicationController } from '../../presentation/controllers/company/job-application.controller';
import { GetApplicationsByJobUseCase } from '../../application/use-cases/company/get-applications-by-job.use-case';
import { GetApplicationsByCompanyUseCase } from '../../application/use-cases/company/get-applications-by-company.use-case';
import { GetApplicationDetailsUseCase } from '../../application/use-cases/company/get-application-details.use-case';
import { UpdateApplicationStageUseCase } from '../../application/use-cases/company/update-application-stage.use-case';
import { UpdateApplicationScoreUseCase } from '../../application/use-cases/company/update-application-score.use-case';
import { AddInterviewUseCase } from '../../application/use-cases/company/add-interview.use-case';
import { UpdateInterviewUseCase } from '../../application/use-cases/company/update-interview.use-case';
import { DeleteInterviewUseCase } from '../../application/use-cases/company/delete-interview.use-case';
import { AddInterviewFeedbackUseCase } from '../../application/use-cases/company/add-interview-feedback.use-case';
import { GetCompanyIdByUserIdUseCase } from '../../application/use-cases/company/get-company-id-by-user-id.use-case';
import { UploadLogoUseCase } from '../../application/use-cases/company/upload-logo.use-case';
import { UploadBusinessLicenseUseCase } from '../../application/use-cases/company/upload-business-license.use-case';
import { UploadWorkplacePictureUseCase } from '../../application/use-cases/company/upload-workplace-picture.use-case';
import { DeleteImageUseCase } from '../../application/use-cases/company/delete-image.use-case';

const companyProfileRepository = new CompanyProfileRepository();
const companyContactRepository = new CompanyContactRepository();
const companyVerificationRepository = new CompanyVerificationRepository();
const companyTechStackRepository = new CompanyTechStackRepository();
const companyOfficeLocationRepository = new CompanyOfficeLocationRepository();
const companyBenefitsRepository = new CompanyBenefitsRepository();
const companyWorkplacePicturesRepository = new CompanyWorkplacePicturesRepository();
const jobPostingRepository = new JobPostingRepository();
const jobApplicationRepository = new JobApplicationRepository();
const userRepository = new UserRepository();
const seekerProfileRepository = new SeekerProfileRepository();
const seekerExperienceRepository = new SeekerExperienceRepository();
const seekerEducationRepository = new SeekerEducationRepository();

const s3Service = new S3Service();

const createCompanyProfileUseCase = new CreateCompanyProfileUseCase(companyProfileRepository, companyContactRepository, companyOfficeLocationRepository, companyVerificationRepository);

const updateCompanyProfileUseCase = new UpdateCompanyProfileUseCase(companyProfileRepository);

const getCompanyProfileUseCase = new GetCompanyProfileUseCase(companyProfileRepository, companyContactRepository, companyTechStackRepository, companyOfficeLocationRepository, companyBenefitsRepository, companyWorkplacePicturesRepository, companyVerificationRepository);

const reapplyCompanyVerificationUseCase = new ReapplyCompanyVerificationUseCase(companyProfileRepository, companyVerificationRepository);

const companyContactUseCase = new CompanyContactUseCase(companyContactRepository);

const createCompanyTechStackUseCase = new CreateCompanyTechStackUseCase(companyTechStackRepository);
const updateCompanyTechStackUseCase = new UpdateCompanyTechStackUseCase(companyTechStackRepository);
const deleteCompanyTechStackUseCase = new DeleteCompanyTechStackUseCase(companyTechStackRepository);
const getCompanyTechStackUseCase = new GetCompanyTechStackUseCase(companyTechStackRepository);

const createCompanyOfficeLocationUseCase = new CreateCompanyOfficeLocationUseCase(companyOfficeLocationRepository);
const updateCompanyOfficeLocationUseCase = new UpdateCompanyOfficeLocationUseCase(companyOfficeLocationRepository);
const deleteCompanyOfficeLocationUseCase = new DeleteCompanyOfficeLocationUseCase(companyOfficeLocationRepository);
const getCompanyOfficeLocationUseCase = new GetCompanyOfficeLocationUseCase(companyOfficeLocationRepository);

const createCompanyBenefitUseCase = new CreateCompanyBenefitUseCase(companyBenefitsRepository);
const updateCompanyBenefitUseCase = new UpdateCompanyBenefitUseCase(companyBenefitsRepository);
const deleteCompanyBenefitUseCase = new DeleteCompanyBenefitUseCase(companyBenefitsRepository);
const getCompanyBenefitUseCase = new GetCompanyBenefitUseCase(companyBenefitsRepository);

const createCompanyWorkplacePictureUseCase = new CreateCompanyWorkplacePictureUseCase(companyWorkplacePicturesRepository);
const updateCompanyWorkplacePictureUseCase = new UpdateCompanyWorkplacePictureUseCase(companyWorkplacePicturesRepository);
const deleteCompanyWorkplacePictureUseCase = new DeleteCompanyWorkplacePictureUseCase(companyWorkplacePicturesRepository);
const getCompanyWorkplacePictureUseCase = new GetCompanyWorkplacePictureUseCase(companyWorkplacePicturesRepository);

const getCompanyProfileByUserIdUseCase = new GetCompanyProfileByUserIdUseCase(companyProfileRepository);

const createJobPostingUseCase = new CreateJobPostingUseCase(jobPostingRepository, getCompanyProfileByUserIdUseCase);

const getJobPostingUseCase = new GetJobPostingUseCase(jobPostingRepository);

const getCompanyJobPostingUseCase = new GetCompanyJobPostingUseCase(jobPostingRepository);

const getCompanyIdByUserIdUseCase = new GetCompanyIdByUserIdUseCase(getCompanyProfileUseCase);

// Upload Use Cases
const uploadLogoUseCase = new UploadLogoUseCase(s3Service);
const uploadBusinessLicenseUseCase = new UploadBusinessLicenseUseCase(s3Service);
const uploadWorkplacePictureUseCase = new UploadWorkplacePictureUseCase(s3Service);
const deleteImageUseCase = new DeleteImageUseCase(s3Service);

const getCompanyJobPostingsUseCase = new GetCompanyJobPostingsUseCase(jobPostingRepository, companyProfileRepository);

const createCompanyProfileFromDtoUseCase = new CreateCompanyProfileFromDtoUseCase(createCompanyProfileUseCase);

const getCompanyProfileWithJobPostingsUseCase = new GetCompanyProfileWithJobPostingsUseCase(getCompanyProfileUseCase, getCompanyJobPostingsUseCase);

const getCompanyDashboardUseCase = new GetCompanyDashboardUseCase(getCompanyProfileUseCase);

const updateJobPostingUseCase = new UpdateJobPostingUseCase(jobPostingRepository);

const deleteJobPostingUseCase = new DeleteJobPostingUseCase(jobPostingRepository, companyProfileRepository);

const incrementJobViewCountUseCase = new IncrementJobViewCountUseCase(jobPostingRepository);

const updateJobStatusUseCase = new UpdateJobStatusUseCase(jobPostingRepository);

// Job Application Use Cases
const getApplicationsByJobUseCase = new GetApplicationsByJobUseCase(jobApplicationRepository, jobPostingRepository, companyProfileRepository, userRepository, seekerProfileRepository, s3Service);
const getApplicationsByCompanyUseCase = new GetApplicationsByCompanyUseCase(jobApplicationRepository, companyProfileRepository, userRepository, seekerProfileRepository, jobPostingRepository, s3Service);
const getApplicationDetailsUseCase = new GetApplicationDetailsUseCase(jobApplicationRepository, jobPostingRepository, companyProfileRepository, userRepository, seekerProfileRepository, seekerExperienceRepository, seekerEducationRepository, s3Service);
const updateApplicationStageUseCase = new UpdateApplicationStageUseCase(jobApplicationRepository, jobPostingRepository, companyProfileRepository, notificationRepository);
const updateApplicationScoreUseCase = new UpdateApplicationScoreUseCase(jobApplicationRepository, jobPostingRepository, companyProfileRepository);
const addInterviewUseCase = new AddInterviewUseCase(jobApplicationRepository, jobPostingRepository, companyProfileRepository, notificationRepository);
const updateInterviewUseCase = new UpdateInterviewUseCase(jobApplicationRepository, jobPostingRepository, companyProfileRepository, notificationRepository);
const deleteInterviewUseCase = new DeleteInterviewUseCase(jobApplicationRepository, jobPostingRepository, companyProfileRepository);
const addInterviewFeedbackUseCase = new AddInterviewFeedbackUseCase(jobApplicationRepository, jobPostingRepository, companyProfileRepository);

// Controllers
const companyProfileController = new CompanyProfileController(
  createCompanyProfileFromDtoUseCase,
  updateCompanyProfileUseCase,
  getCompanyProfileWithJobPostingsUseCase,
  reapplyCompanyVerificationUseCase,
  getCompanyDashboardUseCase,
  uploadLogoUseCase,
);

const companyContactController = new CompanyContactController(
  companyContactUseCase,
  getCompanyIdByUserIdUseCase,
);

const companyTechStackController = new CompanyTechStackController(
  createCompanyTechStackUseCase,
  updateCompanyTechStackUseCase,
  deleteCompanyTechStackUseCase,
  getCompanyTechStackUseCase,
  getCompanyIdByUserIdUseCase,
);

const companyOfficeLocationController = new CompanyOfficeLocationController(
  createCompanyOfficeLocationUseCase,
  updateCompanyOfficeLocationUseCase,
  deleteCompanyOfficeLocationUseCase,
  getCompanyOfficeLocationUseCase,
  getCompanyIdByUserIdUseCase,
);

const companyBenefitController = new CompanyBenefitController(
  createCompanyBenefitUseCase,
  updateCompanyBenefitUseCase,
  deleteCompanyBenefitUseCase,
  getCompanyBenefitUseCase,
  getCompanyIdByUserIdUseCase,
);

const companyWorkplacePictureController = new CompanyWorkplacePictureController(
  createCompanyWorkplacePictureUseCase,
  updateCompanyWorkplacePictureUseCase,
  deleteCompanyWorkplacePictureUseCase,
  getCompanyWorkplacePictureUseCase,
  getCompanyIdByUserIdUseCase,
);

const companyUploadController = new CompanyUploadController(
  uploadBusinessLicenseUseCase,
  uploadWorkplacePictureUseCase,
  deleteImageUseCase,
);

const companyJobPostingController = new CompanyJobPostingController(createJobPostingUseCase, getJobPostingUseCase, getCompanyJobPostingsUseCase, updateJobPostingUseCase, deleteJobPostingUseCase, incrementJobViewCountUseCase, updateJobStatusUseCase, getCompanyJobPostingUseCase, getCompanyProfileByUserIdUseCase);

const companyJobApplicationController = new CompanyJobApplicationController(
  getApplicationsByJobUseCase,
  getApplicationsByCompanyUseCase,
  getApplicationDetailsUseCase,
  updateApplicationStageUseCase,
  updateApplicationScoreUseCase,
  addInterviewUseCase,
  updateInterviewUseCase,
  deleteInterviewUseCase,
  addInterviewFeedbackUseCase,
);

export {
  // Specialized controllers
  companyProfileController,
  companyContactController,
  companyTechStackController,
  companyOfficeLocationController,
  companyBenefitController,
  companyWorkplacePictureController,
  companyUploadController,
  companyJobPostingController,
  companyJobApplicationController,
  // Repositories
  // companyProfileRepository, // removed unused
  // companyProfileRepository as companyRepository, // removed unused
  // companyVerificationRepository, // removed unused
};
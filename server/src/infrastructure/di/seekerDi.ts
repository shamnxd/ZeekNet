import { JobPostingRepository } from '../database/mongodb/repositories/job-posting.repository';
import { AnalyzeResumeUseCase } from '../../application/use-cases/seeker/analyze-resume.use-case';

import { JobApplicationRepository } from '../database/mongodb/repositories/job-application.repository';
import { SeekerProfileRepository } from '../database/mongodb/repositories/seeker-profile.repository';
import { SeekerExperienceRepository } from '../database/mongodb/repositories/seeker-experience.repository';
import { SeekerEducationRepository } from '../database/mongodb/repositories/seeker-education.repository';
import { UserRepository } from '../database/mongodb/repositories/user.repository';
import { CompanyProfileRepository } from '../database/mongodb/repositories/company-profile.repository';
import { notificationRepository, notificationService } from './notificationDi';
import { SeekerProfileController } from '../../presentation/controllers/seeker/seeker-profile.controller';
import { SeekerJobApplicationController } from '../../presentation/controllers/seeker/job-application.controller';
import { CreateJobApplicationUseCase } from '../../application/use-cases/seeker/create-job-application.use-case';
import { GetApplicationsBySeekerUseCase } from '../../application/use-cases/seeker/get-applications-by-seeker.use-case';
import { GetSeekerApplicationDetailsUseCase } from '../../application/use-cases/seeker/get-seeker-application-details.use-case';
import { CreateSeekerProfileUseCase } from '../../application/use-cases/seeker/create-seeker-profile.use-case';
import { GetSeekerProfileUseCase } from '../../application/use-cases/seeker/get-seeker-profile.use-case';
import { UpdateSeekerProfileUseCase } from '../../application/use-cases/seeker/update-seeker-profile.use-case';
import { AddExperienceUseCase } from '../../application/use-cases/seeker/add-experience.use-case';
import { GetExperiencesUseCase } from '../../application/use-cases/seeker/get-experiences.use-case';
import { UpdateExperienceUseCase } from '../../application/use-cases/seeker/update-experience.use-case';
import { RemoveExperienceUseCase } from '../../application/use-cases/seeker/remove-experience.use-case';
import { AddEducationUseCase } from '../../application/use-cases/seeker/add-education.use-case';
import { GetEducationUseCase } from '../../application/use-cases/seeker/get-education.use-case';
import { UpdateEducationUseCase } from '../../application/use-cases/seeker/update-education.use-case';
import { RemoveEducationUseCase } from '../../application/use-cases/seeker/remove-education.use-case';
import { UpdateSkillsUseCase } from '../../application/use-cases/seeker/update-skills.use-case';
import { UpdateLanguagesUseCase } from '../../application/use-cases/seeker/update-languages.use-case';
import { UploadResumeUseCase } from '../../application/use-cases/seeker/upload-resume.use-case';
import { RemoveResumeUseCase } from '../../application/use-cases/seeker/remove-resume.use-case';
import { UploadAvatarUseCase } from '../../application/use-cases/seeker/upload-avatar.use-case';
import { UploadBannerUseCase } from '../../application/use-cases/seeker/upload-banner.use-case';
import { S3Service } from '../external-services/s3/s3.service';
import { ATSInterviewRepository } from '../database/mongodb/repositories/ats-interview.repository';
import { ATSTechnicalTaskRepository } from '../database/mongodb/repositories/ats-technical-task.repository';
import { ATSOfferRepository } from '../database/mongodb/repositories/ats-offer.repository';
import { ATSCompensationRepository } from '../database/mongodb/repositories/ats-compensation.repository';
import { ATSCompensationMeetingRepository } from '../database/mongodb/repositories/ats-compensation-meeting.repository';
import { ATSActivityRepository } from '../database/mongodb/repositories/ats-activity.repository';
import { UpdateApplicationSubStageUseCase } from '../../application/use-cases/ats/update-application-sub-stage.use-case';
import { ActivityLoggerService } from '../../application/services/activity-logger.service';
import { AtsService } from '../services/ats.service';
import { ResumeParserService } from '../services/resume-parser.service';
import { env } from '../config/env';
import { GetInterviewsByApplicationUseCase } from '../../application/use-cases/seeker/get-interviews-by-application.use-case';
import { GetTechnicalTasksByApplicationUseCase } from '../../application/use-cases/seeker/get-technical-tasks-by-application.use-case';
import { SubmitTechnicalTaskUseCase } from '../../application/use-cases/seeker/submit-technical-task.use-case';
import { GetOffersByApplicationUseCase } from '../../application/use-cases/seeker/get-offers-by-application.use-case';
import { GetCompensationByApplicationUseCase } from '../../application/use-cases/seeker/get-compensation-by-application.use-case';
import { GetCompensationMeetingsByApplicationUseCase } from '../../application/use-cases/seeker/get-compensation-meetings-by-application.use-case';
import { UpdateOfferStatusUseCase } from '../../application/use-cases/seeker/update-offer-status.use-case';
import { UploadSignedOfferDocumentUseCase } from '../../application/use-cases/seeker/upload-signed-offer-document.use-case';

const jobPostingRepository = new JobPostingRepository();
const jobApplicationRepository = new JobApplicationRepository();
const seekerProfileRepository = new SeekerProfileRepository();
const seekerExperienceRepository = new SeekerExperienceRepository();
const seekerEducationRepository = new SeekerEducationRepository();
const userRepository = new UserRepository();
const companyProfileRepository = new CompanyProfileRepository();
const s3Service = new S3Service();
const interviewRepository = new ATSInterviewRepository();
const technicalTaskRepository = new ATSTechnicalTaskRepository();
const offerRepository = new ATSOfferRepository();
const compensationRepository = new ATSCompensationRepository();
const compensationMeetingRepository = new ATSCompensationMeetingRepository();
const activityRepository = new ATSActivityRepository();
const activityLoggerService = new ActivityLoggerService(activityRepository);
const atsService = new AtsService(env.GROQ_API_KEY);
const resumeParserService = new ResumeParserService();

const createSeekerProfileUseCase = new CreateSeekerProfileUseCase(seekerProfileRepository, s3Service);
const getSeekerProfileUseCase = new GetSeekerProfileUseCase(seekerProfileRepository, seekerExperienceRepository, seekerEducationRepository, userRepository, s3Service);
const updateSeekerProfileUseCase = new UpdateSeekerProfileUseCase(seekerProfileRepository, s3Service, userRepository);
const addExperienceUseCase = new AddExperienceUseCase(seekerProfileRepository, seekerExperienceRepository);
const getExperiencesUseCase = new GetExperiencesUseCase(seekerProfileRepository, seekerExperienceRepository);
const updateExperienceUseCase = new UpdateExperienceUseCase(seekerProfileRepository, seekerExperienceRepository);
const removeExperienceUseCase = new RemoveExperienceUseCase(seekerProfileRepository, seekerExperienceRepository);
const addEducationUseCase = new AddEducationUseCase(seekerProfileRepository, seekerEducationRepository);
const getEducationUseCase = new GetEducationUseCase(seekerProfileRepository, seekerEducationRepository);
const updateEducationUseCase = new UpdateEducationUseCase(seekerProfileRepository, seekerEducationRepository);
const removeEducationUseCase = new RemoveEducationUseCase(seekerProfileRepository, seekerEducationRepository);
const updateSkillsUseCase = new UpdateSkillsUseCase(seekerProfileRepository);
const updateLanguagesUseCase = new UpdateLanguagesUseCase(seekerProfileRepository);
const uploadResumeUseCase = new UploadResumeUseCase(seekerProfileRepository);
const removeResumeUseCase = new RemoveResumeUseCase(seekerProfileRepository);
const uploadAvatarUseCase = new UploadAvatarUseCase(seekerProfileRepository, s3Service);
const uploadBannerUseCase = new UploadBannerUseCase(seekerProfileRepository, s3Service);


const createJobApplicationUseCase = new CreateJobApplicationUseCase(jobApplicationRepository, jobPostingRepository, userRepository, companyProfileRepository, notificationRepository, notificationService, atsService, resumeParserService);
const getApplicationsBySeekerUseCase = new GetApplicationsBySeekerUseCase(jobApplicationRepository, jobPostingRepository, companyProfileRepository, userRepository, s3Service);
const getSeekerApplicationDetailsUseCase = new GetSeekerApplicationDetailsUseCase(jobApplicationRepository, jobPostingRepository);
const analyzeResumeUseCase = new AnalyzeResumeUseCase(jobPostingRepository, atsService, resumeParserService);
const updateApplicationSubStageUseCase = new UpdateApplicationSubStageUseCase(
  jobApplicationRepository,
  jobPostingRepository,
  activityLoggerService,
);

// New Use Cases for seeker job application operations
const getInterviewsByApplicationUseCase = new GetInterviewsByApplicationUseCase(jobApplicationRepository, interviewRepository);
const getTechnicalTasksByApplicationUseCase = new GetTechnicalTasksByApplicationUseCase(jobApplicationRepository, technicalTaskRepository, s3Service);
const submitTechnicalTaskUseCase = new SubmitTechnicalTaskUseCase(jobApplicationRepository, technicalTaskRepository);
const getOffersByApplicationUseCase = new GetOffersByApplicationUseCase(jobApplicationRepository, offerRepository, s3Service);
const getCompensationByApplicationUseCase = new GetCompensationByApplicationUseCase(jobApplicationRepository, compensationRepository);
const getCompensationMeetingsByApplicationUseCase = new GetCompensationMeetingsByApplicationUseCase(jobApplicationRepository, compensationMeetingRepository);
const updateOfferStatusUseCase = new UpdateOfferStatusUseCase(jobApplicationRepository, offerRepository);
const uploadSignedOfferDocumentUseCase = new UploadSignedOfferDocumentUseCase(jobApplicationRepository, offerRepository, updateApplicationSubStageUseCase);

const seekerProfileController = new SeekerProfileController(
  createSeekerProfileUseCase,
  getSeekerProfileUseCase,
  updateSeekerProfileUseCase,
  addExperienceUseCase,
  getExperiencesUseCase,
  updateExperienceUseCase,
  removeExperienceUseCase,
  addEducationUseCase,
  getEducationUseCase,
  updateEducationUseCase,
  removeEducationUseCase,
  updateSkillsUseCase,
  updateLanguagesUseCase,
  uploadResumeUseCase,
  removeResumeUseCase,
  uploadAvatarUseCase,
  uploadBannerUseCase,
);

const seekerJobApplicationController = new SeekerJobApplicationController(
  createJobApplicationUseCase,
  getApplicationsBySeekerUseCase,
  getSeekerApplicationDetailsUseCase,
  analyzeResumeUseCase,
  getInterviewsByApplicationUseCase,
  getTechnicalTasksByApplicationUseCase,
  submitTechnicalTaskUseCase,
  getOffersByApplicationUseCase,
  getCompensationByApplicationUseCase,
  getCompensationMeetingsByApplicationUseCase,
  updateOfferStatusUseCase,
  uploadSignedOfferDocumentUseCase,
  s3Service,
);

export { seekerJobApplicationController, seekerProfileController };
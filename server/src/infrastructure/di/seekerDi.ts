import { JobPostingRepository } from 'src/infrastructure/persistence/mongodb/repositories/job-posting.repository';
import { AnalyzeResumeUseCase } from 'src/application/use-cases/seeker/score-checker/analyze-resume.use-case';

import { JobApplicationRepository } from 'src/infrastructure/persistence/mongodb/repositories/job-application.repository';
import { SeekerProfileRepository } from 'src/infrastructure/persistence/mongodb/repositories/seeker-profile.repository';
import { SeekerExperienceRepository } from 'src/infrastructure/persistence/mongodb/repositories/seeker-experience.repository';
import { SeekerEducationRepository } from 'src/infrastructure/persistence/mongodb/repositories/seeker-education.repository';
import { UserRepository } from 'src/infrastructure/persistence/mongodb/repositories/user.repository';
import { CompanyProfileRepository } from 'src/infrastructure/persistence/mongodb/repositories/company-profile.repository';
import { notificationRepository, notificationService } from 'src/infrastructure/di/notificationDi';
import { SeekerProfileController } from 'src/presentation/controllers/seeker/profile/seeker-profile.controller';
import { SeekerJobApplicationController } from 'src/presentation/controllers/seeker/applications/job-application.controller';
import { CreateJobApplicationUseCase } from 'src/application/use-cases/seeker/applications/create-job-application.use-case';
import { CalculateATSScoreUseCase } from 'src/application/use-cases/seeker/applications/calculate-ats-score.use-case';
import { GetApplicationsBySeekerUseCase } from 'src/application/use-cases/seeker/applications/get-applications-by-seeker.use-case';
import { GetSeekerApplicationDetailsUseCase } from 'src/application/use-cases/seeker/applications/get-seeker-application-details.use-case';
import { CreateSeekerProfileUseCase } from 'src/application/use-cases/seeker/profile/info/create-seeker-profile.use-case';
import { GetSeekerProfileUseCase } from 'src/application/use-cases/seeker/profile/info/get-seeker-profile.use-case';
import { UpdateSeekerProfileUseCase } from 'src/application/use-cases/seeker/profile/info/update-seeker-profile.use-case';
import { AddExperienceUseCase } from 'src/application/use-cases/seeker/profile/experience/add-experience.use-case';
import { GetExperiencesUseCase } from 'src/application/use-cases/seeker/profile/experience/get-experiences.use-case';
import { UpdateExperienceUseCase } from 'src/application/use-cases/seeker/profile/experience/update-experience.use-case';
import { RemoveExperienceUseCase } from 'src/application/use-cases/seeker/profile/experience/remove-experience.use-case';
import { AddEducationUseCase } from 'src/application/use-cases/seeker/profile/education/add-education.use-case';
import { GetEducationUseCase } from 'src/application/use-cases/seeker/profile/education/get-education.use-case';
import { UpdateEducationUseCase } from 'src/application/use-cases/seeker/profile/education/update-education.use-case';
import { RemoveEducationUseCase } from 'src/application/use-cases/seeker/profile/education/remove-education.use-case';
import { UpdateSkillsUseCase } from 'src/application/use-cases/seeker/profile/skills/update-skills.use-case';
import { UpdateLanguagesUseCase } from 'src/application/use-cases/seeker/profile/languages/update-languages.use-case';
import { UploadResumeUseCase } from 'src/application/use-cases/seeker/media/upload-resume.use-case';
import { RemoveResumeUseCase } from 'src/application/use-cases/seeker/media/remove-resume.use-case';
import { UploadAvatarUseCase } from 'src/application/use-cases/seeker/media/upload-avatar.use-case';
import { UploadBannerUseCase } from 'src/application/use-cases/seeker/media/upload-banner.use-case';
import { S3Service } from 'src/infrastructure/external-services/s3/s3.service';
import { ATSInterviewRepository } from 'src/infrastructure/persistence/mongodb/repositories/ats-interview.repository';
import { ATSTechnicalTaskRepository } from 'src/infrastructure/persistence/mongodb/repositories/ats-technical-task.repository';
import { ATSOfferRepository } from 'src/infrastructure/persistence/mongodb/repositories/ats-offer.repository';
import { ATSCompensationRepository } from 'src/infrastructure/persistence/mongodb/repositories/ats-compensation.repository';
import { ATSCompensationMeetingRepository } from 'src/infrastructure/persistence/mongodb/repositories/ats-compensation-meeting.repository';
import { ATSActivityRepository } from 'src/infrastructure/persistence/mongodb/repositories/ats-activity.repository';
import { UpdateApplicationSubStageUseCase } from 'src/application/use-cases/application/pipeline/update-application-sub-stage.use-case';
import { ActivityLoggerService } from 'src/application/services/activity-logger.service';
import { AtsService } from 'src/infrastructure/external-services/ai/ats-groq.service';
import { ResumeParserService } from 'src/infrastructure/services/resume-parser.service';
import { env } from 'src/infrastructure/config/env';
import { GetInterviewsByApplicationUseCase } from 'src/application/use-cases/seeker/applications/get-interviews-by-application.use-case';
import { GetTechnicalTasksByApplicationUseCase } from 'src/application/use-cases/seeker/applications/get-technical-tasks-by-application.use-case';
import { SubmitTechnicalTaskUseCase } from 'src/application/use-cases/seeker/applications/submit-technical-task.use-case';
import { GetOffersByApplicationUseCase } from 'src/application/use-cases/seeker/applications/get-offers-by-application.use-case';
import { GetCompensationByApplicationUseCase } from 'src/application/use-cases/seeker/applications/get-compensation-by-application.use-case';
import { GetCompensationMeetingsByApplicationUseCase } from 'src/application/use-cases/seeker/applications/get-compensation-meetings-by-application.use-case';
import { UpdateOfferStatusUseCase } from 'src/application/use-cases/application/offer/update-offer-status.use-case';
import { UploadSignedOfferDocumentUseCase } from 'src/application/use-cases/seeker/applications/upload-signed-offer-document.use-case';
import { FileUploadService } from 'src/application/services/file-upload.service';
import { LoggerService } from 'src/infrastructure/services/logger.service';

import { logger } from 'src/infrastructure/config/logger';

logger.info('Initializing seekerDi...');
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
const loggerService = new LoggerService();

import { NodemailerService } from 'src/infrastructure/messaging/mailer';
import { EmailTemplateService } from 'src/infrastructure/messaging/email-template.service';

const mailerService = new NodemailerService();
const emailTemplateService = new EmailTemplateService();
const fileUploadService = new FileUploadService(s3Service);

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



const calculateATSScoreUseCase = new CalculateATSScoreUseCase(jobApplicationRepository, atsService, loggerService);

const createJobApplicationUseCase = new CreateJobApplicationUseCase(
  jobApplicationRepository,
  jobPostingRepository,
  userRepository,
  companyProfileRepository,
  notificationService,
  resumeParserService,
  calculateATSScoreUseCase,
  mailerService,
  emailTemplateService,
  fileUploadService,
  loggerService,
);
const getApplicationsBySeekerUseCase = new GetApplicationsBySeekerUseCase(jobApplicationRepository, jobPostingRepository, companyProfileRepository, userRepository, s3Service, loggerService);
const getSeekerApplicationDetailsUseCase = new GetSeekerApplicationDetailsUseCase(jobApplicationRepository, jobPostingRepository);
const analyzeResumeUseCase = new AnalyzeResumeUseCase(jobPostingRepository, atsService, resumeParserService);
const updateApplicationSubStageUseCase = new UpdateApplicationSubStageUseCase(
  jobApplicationRepository,
  jobPostingRepository,
  activityLoggerService,
);


const getInterviewsByApplicationUseCase = new GetInterviewsByApplicationUseCase(jobApplicationRepository, interviewRepository);
const getTechnicalTasksByApplicationUseCase = new GetTechnicalTasksByApplicationUseCase(jobApplicationRepository, technicalTaskRepository, s3Service);
const submitTechnicalTaskUseCase = new SubmitTechnicalTaskUseCase(jobApplicationRepository, technicalTaskRepository, fileUploadService);
const getOffersByApplicationUseCase = new GetOffersByApplicationUseCase(jobApplicationRepository, offerRepository, s3Service, loggerService);
const getCompensationByApplicationUseCase = new GetCompensationByApplicationUseCase(jobApplicationRepository, compensationRepository);
const getCompensationMeetingsByApplicationUseCase = new GetCompensationMeetingsByApplicationUseCase(jobApplicationRepository, compensationMeetingRepository);

const updateOfferStatusUseCase = new UpdateOfferStatusUseCase(
  offerRepository,
  jobApplicationRepository,
  jobPostingRepository,
  userRepository,
  updateApplicationSubStageUseCase,
  activityLoggerService,
  mailerService,
  emailTemplateService,
  loggerService,
);

const uploadSignedOfferDocumentUseCase = new UploadSignedOfferDocumentUseCase(jobApplicationRepository, offerRepository, updateApplicationSubStageUseCase, fileUploadService, loggerService);

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
);

export { seekerJobApplicationController, seekerProfileController, getSeekerProfileUseCase };
logger.info('seekerDi initialization complete');

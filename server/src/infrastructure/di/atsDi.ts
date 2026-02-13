import { ATSPipelineController } from 'src/presentation/controllers/ats/pipeline/ats-pipeline.controller';
import { ATSInterviewController } from 'src/presentation/controllers/ats/evaluation/ats-interview.controller';
import { ATSTechnicalTaskController } from 'src/presentation/controllers/ats/evaluation/ats-technical-task.controller';
import { ATSOfferController } from 'src/presentation/controllers/ats/offer/ats-offer.controller';
import { ATSCommentController } from 'src/presentation/controllers/ats/comments/ats-comment.controller';
import { ATSCompensationController } from 'src/presentation/controllers/ats/offer/ats-compensation.controller';

import { logger } from 'src/infrastructure/config/logger';



import { ScheduleInterviewUseCase } from 'src/application/use-cases/application/interview/schedule-interview.use-case';
import { UpdateInterviewUseCase } from 'src/application/use-cases/application/interview/update-interview.use-case';
import { AssignTechnicalTaskUseCase } from 'src/application/use-cases/application/task/assign-technical-task.use-case';
import { UpdateTechnicalTaskUseCase } from 'src/application/use-cases/application/task/update-technical-task.use-case';
import { DeleteTechnicalTaskUseCase } from 'src/application/use-cases/application/task/delete-technical-task.use-case';
import { UploadOfferUseCase } from 'src/application/use-cases/application/offer/upload-offer.use-case';
import { UpdateOfferStatusUseCase } from 'src/application/use-cases/application/offer/update-offer-status.use-case';
import { AddCommentUseCase } from 'src/application/use-cases/application/comments/add-comment.use-case';

import { GetInterviewsByApplicationUseCase } from 'src/application/use-cases/application/interview/get-interviews-by-application.use-case';
import { GetTechnicalTasksByApplicationUseCase } from 'src/application/use-cases/application/task/get-technical-tasks-by-application.use-case';
import { GetOffersByApplicationUseCase } from 'src/application/use-cases/application/offer/get-offers-by-application.use-case';
import { MoveApplicationStageUseCase } from 'src/application/use-cases/application/pipeline/move-application-stage.use-case';
import { UpdateApplicationSubStageUseCase } from 'src/application/use-cases/application/pipeline/update-application-sub-stage.use-case';
import { GetJobATSPipelineUseCase } from 'src/application/use-cases/application/pipeline/get-job-ats-pipeline.use-case';
import { GetJobApplicationsForKanbanUseCase } from 'src/application/use-cases/application/pipeline/get-job-applications-for-kanban.use-case';
import { InitiateCompensationUseCase } from 'src/application/use-cases/application/compensation/initiate-compensation.use-case';
import { UpdateCompensationUseCase } from 'src/application/use-cases/application/compensation/update-compensation.use-case';
import { GetCompensationUseCase } from 'src/application/use-cases/application/compensation/get-compensation.use-case';
import { ScheduleCompensationMeetingUseCase } from 'src/application/use-cases/application/compensation/schedule-compensation-meeting.use-case';
import { GetCompensationMeetingsUseCase } from 'src/application/use-cases/application/compensation/get-compensation-meetings.use-case';
import { UpdateCompensationMeetingStatusUseCase } from 'src/application/use-cases/application/compensation/update-compensation-meeting-status.use-case';
import { GetCommentsByApplicationUseCase } from 'src/application/use-cases/application/comments/get-comments-by-application.use-case';


import { FileUploadService } from 'src/application/services/file-upload.service';
import { LoggerService } from 'src/infrastructure/services/logger.service';

import { ATSInterviewRepository } from 'src/infrastructure/persistence/mongodb/repositories/ats-interview.repository';
import { ATSTechnicalTaskRepository } from 'src/infrastructure/persistence/mongodb/repositories/ats-technical-task.repository';
import { ATSOfferRepository } from 'src/infrastructure/persistence/mongodb/repositories/ats-offer.repository';
import { ATSCommentRepository } from 'src/infrastructure/persistence/mongodb/repositories/ats-comment.repository';

import { ATSCompensationRepository } from 'src/infrastructure/persistence/mongodb/repositories/ats-compensation.repository';
import { ATSCompensationMeetingRepository } from 'src/infrastructure/persistence/mongodb/repositories/ats-compensation-meeting.repository';
import { JobApplicationRepository } from 'src/infrastructure/persistence/mongodb/repositories/job-application.repository';
import { JobPostingRepository } from 'src/infrastructure/persistence/mongodb/repositories/job-posting.repository';
import { UserRepository } from 'src/infrastructure/persistence/mongodb/repositories/user.repository';
import { S3Service } from 'src/infrastructure/external-services/s3/s3.service';
import { getCompanyIdByUserIdUseCase } from 'src/infrastructure/di/companyDi';
import { NodemailerService } from 'src/infrastructure/messaging/mailer';
import { EmailTemplateService } from 'src/infrastructure/messaging/email-template.service';
import { SeekerProfileRepository } from '../persistence/mongodb/repositories/seeker-profile.repository';

const interviewRepository = new ATSInterviewRepository();
const technicalTaskRepository = new ATSTechnicalTaskRepository();
const offerRepository = new ATSOfferRepository();
const commentRepository = new ATSCommentRepository();

const compensationRepository = new ATSCompensationRepository();
const compensationMeetingRepository = new ATSCompensationMeetingRepository();
const jobApplicationRepository = new JobApplicationRepository();
const jobPostingRepository = new JobPostingRepository();
const userRepository = new UserRepository();
const s3Service = new S3Service();
const seekerProfileRepository = new SeekerProfileRepository();



const mailerService = new NodemailerService();
const emailTemplateService = new EmailTemplateService();


const fileUploadService = new FileUploadService(s3Service);
const loggerService = new LoggerService();

const scheduleInterviewUseCase = new ScheduleInterviewUseCase(
  interviewRepository,
  jobApplicationRepository,
  jobPostingRepository,
  userRepository,
  mailerService,
  emailTemplateService,
  loggerService,
);
const updateInterviewUseCase = new UpdateInterviewUseCase(interviewRepository, jobApplicationRepository, userRepository);

const getInterviewsByApplicationUseCase = new GetInterviewsByApplicationUseCase(interviewRepository);
const assignTechnicalTaskUseCase = new AssignTechnicalTaskUseCase(
  technicalTaskRepository,
  jobApplicationRepository,
  jobPostingRepository,
  userRepository,
  mailerService,
  emailTemplateService,
  loggerService,
);
const updateTechnicalTaskUseCase = new UpdateTechnicalTaskUseCase(technicalTaskRepository, jobApplicationRepository, userRepository);
const deleteTechnicalTaskUseCase = new DeleteTechnicalTaskUseCase(technicalTaskRepository, jobApplicationRepository);
const getTechnicalTasksByApplicationUseCase = new GetTechnicalTasksByApplicationUseCase(technicalTaskRepository);
const uploadOfferUseCase = new UploadOfferUseCase(offerRepository, jobApplicationRepository, userRepository);
const getOffersByApplicationUseCase = new GetOffersByApplicationUseCase(offerRepository);

const updateApplicationSubStageUseCase = new UpdateApplicationSubStageUseCase(
  jobApplicationRepository,
  jobPostingRepository,
  commentRepository,
);
const updateOfferStatusUseCase = new UpdateOfferStatusUseCase(
  offerRepository,
  jobApplicationRepository,
  jobPostingRepository,
  userRepository,
  updateApplicationSubStageUseCase,
  mailerService,
  emailTemplateService,
  loggerService,
);
const addCommentUseCase = new AddCommentUseCase(commentRepository);

const moveApplicationStageUseCase = new MoveApplicationStageUseCase(
  jobApplicationRepository,
  jobPostingRepository,
  commentRepository,
  userRepository,
  mailerService,
  emailTemplateService,
  loggerService,
);
const getJobPipelineUseCase = new GetJobATSPipelineUseCase(jobPostingRepository, getCompanyIdByUserIdUseCase);
const getJobApplicationsForKanbanUseCase = new GetJobApplicationsForKanbanUseCase(
  jobApplicationRepository,
  jobPostingRepository,
  userRepository,
  seekerProfileRepository,
  s3Service,
  getCompanyIdByUserIdUseCase,
);
const initiateCompensationUseCase = new InitiateCompensationUseCase(
  compensationRepository,
  jobApplicationRepository,
  jobPostingRepository,
  userRepository,
  addCommentUseCase,
  mailerService,
  emailTemplateService,
  loggerService,
);
const updateCompensationUseCase = new UpdateCompensationUseCase(compensationRepository, jobApplicationRepository, addCommentUseCase, userRepository);
const getCompensationUseCase = new GetCompensationUseCase(compensationRepository);
const scheduleCompensationMeetingUseCase = new ScheduleCompensationMeetingUseCase(compensationMeetingRepository, jobApplicationRepository, userRepository);
const getCompensationMeetingsUseCase = new GetCompensationMeetingsUseCase(compensationMeetingRepository);
const updateCompensationMeetingStatusUseCase = new UpdateCompensationMeetingStatusUseCase(compensationMeetingRepository, jobApplicationRepository, userRepository);
const getCommentsByApplicationUseCase = new GetCommentsByApplicationUseCase(commentRepository);

export const atsInterviewController = new ATSInterviewController(
  scheduleInterviewUseCase,
  updateInterviewUseCase,
  getInterviewsByApplicationUseCase,
);

export const atsTechnicalTaskController = new ATSTechnicalTaskController(
  assignTechnicalTaskUseCase,
  updateTechnicalTaskUseCase,
  deleteTechnicalTaskUseCase,
  getTechnicalTasksByApplicationUseCase,
);

export const atsOfferController = new ATSOfferController(
  uploadOfferUseCase,
  updateOfferStatusUseCase,
  getOffersByApplicationUseCase,
);

export const atsCommentController = new ATSCommentController(
  addCommentUseCase,
  getCommentsByApplicationUseCase,
);

export const atsCompensationController = new ATSCompensationController(
  initiateCompensationUseCase,
  updateCompensationUseCase,
  getCompensationUseCase,
  scheduleCompensationMeetingUseCase,
  getCompensationMeetingsUseCase,
  updateCompensationMeetingStatusUseCase,
);



export const atsPipelineController = new ATSPipelineController(
  getJobPipelineUseCase,
  getJobApplicationsForKanbanUseCase,
  moveApplicationStageUseCase,
  updateApplicationSubStageUseCase,
);



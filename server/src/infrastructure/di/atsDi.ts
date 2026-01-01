
import { ATSPipelineController } from '../../presentation/controllers/company/ats-pipeline.controller';
import { ATSInterviewController } from '../../presentation/controllers/company/ats-interview.controller';
import { ATSTechnicalTaskController } from '../../presentation/controllers/company/ats-technical-task.controller';
import { ATSOfferController } from '../../presentation/controllers/company/ats-offer.controller';
import { ATSCommentController } from '../../presentation/controllers/company/ats-comment.controller';
import { ATSCompensationController } from '../../presentation/controllers/company/ats-compensation.controller';
import { ATSActivityController } from '../../presentation/controllers/company/ats-activity.controller';

import { ScheduleInterviewUseCase } from '../../application/use-cases/ats/schedule-interview.use-case';
import { UpdateInterviewUseCase } from '../../application/use-cases/ats/update-interview.use-case';
import { AssignTechnicalTaskUseCase } from '../../application/use-cases/ats/assign-technical-task.use-case';
import { UpdateTechnicalTaskUseCase } from '../../application/use-cases/ats/update-technical-task.use-case';
import { DeleteTechnicalTaskUseCase } from '../../application/use-cases/ats/delete-technical-task.use-case';
import { UploadOfferUseCase } from '../../application/use-cases/ats/upload-offer.use-case';
import { UpdateOfferStatusUseCase } from '../../application/use-cases/ats/update-offer-status.use-case';
import { AddCommentUseCase } from '../../application/use-cases/ats/add-comment.use-case';
import { GetApplicationActivitiesPaginatedUseCase } from '../../application/use-cases/ats/get-application-activities-paginated.use-case';
import { GetInterviewsByApplicationUseCase } from '../../application/use-cases/ats/get-interviews-by-application.use-case';
import { GetTechnicalTasksByApplicationUseCase } from '../../application/use-cases/ats/get-technical-tasks-by-application.use-case';
import { GetOffersByApplicationUseCase } from '../../application/use-cases/ats/get-offers-by-application.use-case';
import { MoveApplicationStageUseCase } from '../../application/use-cases/ats/move-application-stage.use-case';
import { UpdateApplicationSubStageUseCase } from '../../application/use-cases/ats/update-application-sub-stage.use-case';
import { GetJobATSPipelineUseCase } from '../../application/use-cases/ats/get-job-ats-pipeline.use-case';
import { GetJobApplicationsForKanbanUseCase } from '../../application/use-cases/ats/get-job-applications-for-kanban.use-case';
import { InitiateCompensationUseCase } from '../../application/use-cases/ats/initiate-compensation.use-case';
import { UpdateCompensationUseCase } from '../../application/use-cases/ats/update-compensation.use-case';
import { GetCompensationUseCase } from '../../application/use-cases/ats/get-compensation.use-case';
import { ScheduleCompensationMeetingUseCase } from '../../application/use-cases/ats/schedule-compensation-meeting.use-case';
import { GetCompensationMeetingsUseCase } from '../../application/use-cases/ats/get-compensation-meetings.use-case';
import { UpdateCompensationMeetingStatusUseCase } from '../../application/use-cases/ats/update-compensation-meeting-status.use-case';
import { GetCommentsByApplicationUseCase } from '../../application/use-cases/ats/get-comments-by-application.use-case';

import { ActivityLoggerService } from '../../application/services/activity-logger.service';
import { FileUrlService } from '../../application/services/file-url.service';

import { ATSInterviewRepository } from '../persistence/mongodb/repositories/ats-interview.repository';
import { ATSTechnicalTaskRepository } from '../persistence/mongodb/repositories/ats-technical-task.repository';
import { ATSOfferRepository } from '../persistence/mongodb/repositories/ats-offer.repository';
import { ATSCommentRepository } from '../persistence/mongodb/repositories/ats-comment.repository';
import { ATSActivityRepository } from '../persistence/mongodb/repositories/ats-activity.repository';
import { ATSCompensationRepository } from '../persistence/mongodb/repositories/ats-compensation.repository';
import { ATSCompensationMeetingRepository } from '../persistence/mongodb/repositories/ats-compensation-meeting.repository';
import { JobApplicationRepository } from '../persistence/mongodb/repositories/job-application.repository';
import { JobPostingRepository } from '../persistence/mongodb/repositories/job-posting.repository';
import { UserRepository } from '../persistence/mongodb/repositories/user.repository';
import { S3Service } from '../external-services/s3/s3.service';
import { getCompanyIdByUserIdUseCase } from './companyDi';

const interviewRepository = new ATSInterviewRepository();
const technicalTaskRepository = new ATSTechnicalTaskRepository();
const offerRepository = new ATSOfferRepository();
const commentRepository = new ATSCommentRepository();
const activityRepository = new ATSActivityRepository();
const compensationRepository = new ATSCompensationRepository();
const compensationMeetingRepository = new ATSCompensationMeetingRepository();
const jobApplicationRepository = new JobApplicationRepository();
const jobPostingRepository = new JobPostingRepository();
const userRepository = new UserRepository();
const s3Service = new S3Service();

const activityLoggerService = new ActivityLoggerService(activityRepository);
const fileUrlService = new FileUrlService(s3Service);

const scheduleInterviewUseCase = new ScheduleInterviewUseCase(interviewRepository, jobApplicationRepository, activityLoggerService);
const updateInterviewUseCase = new UpdateInterviewUseCase(interviewRepository, jobApplicationRepository, activityLoggerService);
const getInterviewsByApplicationUseCase = new GetInterviewsByApplicationUseCase(interviewRepository);
const assignTechnicalTaskUseCase = new AssignTechnicalTaskUseCase(technicalTaskRepository, jobApplicationRepository, activityLoggerService);
const updateTechnicalTaskUseCase = new UpdateTechnicalTaskUseCase(technicalTaskRepository, jobApplicationRepository, activityLoggerService);
const deleteTechnicalTaskUseCase = new DeleteTechnicalTaskUseCase(technicalTaskRepository, jobApplicationRepository, activityLoggerService);
const getTechnicalTasksByApplicationUseCase = new GetTechnicalTasksByApplicationUseCase(technicalTaskRepository);
const uploadOfferUseCase = new UploadOfferUseCase(offerRepository, jobApplicationRepository, activityLoggerService);
const getOffersByApplicationUseCase = new GetOffersByApplicationUseCase(offerRepository);
// Note: updateApplicationSubStageUseCase must be initialized before updateOfferStatusUseCase due to dependency
const updateApplicationSubStageUseCase = new UpdateApplicationSubStageUseCase(
  jobApplicationRepository,
  jobPostingRepository,
  activityLoggerService,
);
const updateOfferStatusUseCase = new UpdateOfferStatusUseCase(offerRepository, jobApplicationRepository, updateApplicationSubStageUseCase, activityLoggerService);
const addCommentUseCase = new AddCommentUseCase(commentRepository, activityLoggerService);
const getApplicationActivitiesPaginatedUseCase = new GetApplicationActivitiesPaginatedUseCase(activityRepository);
const moveApplicationStageUseCase = new MoveApplicationStageUseCase(
  jobApplicationRepository,
  jobPostingRepository,
  activityLoggerService,
);
const getJobPipelineUseCase = new GetJobATSPipelineUseCase(jobPostingRepository);
const getJobApplicationsForKanbanUseCase = new GetJobApplicationsForKanbanUseCase(
  jobApplicationRepository,
  jobPostingRepository,
  userRepository,
);
const initiateCompensationUseCase = new InitiateCompensationUseCase(compensationRepository, jobApplicationRepository, addCommentUseCase, activityLoggerService);
const updateCompensationUseCase = new UpdateCompensationUseCase(compensationRepository, jobApplicationRepository, addCommentUseCase, activityLoggerService);
const getCompensationUseCase = new GetCompensationUseCase(compensationRepository);
const scheduleCompensationMeetingUseCase = new ScheduleCompensationMeetingUseCase(compensationMeetingRepository, jobApplicationRepository, activityLoggerService);
const getCompensationMeetingsUseCase = new GetCompensationMeetingsUseCase(compensationMeetingRepository);
const updateCompensationMeetingStatusUseCase = new UpdateCompensationMeetingStatusUseCase(compensationMeetingRepository, jobApplicationRepository, activityLoggerService);
const getCommentsByApplicationUseCase = new GetCommentsByApplicationUseCase(commentRepository);

export const atsInterviewController = new ATSInterviewController(
  scheduleInterviewUseCase,
  updateInterviewUseCase,
  getInterviewsByApplicationUseCase,
  fileUrlService,
);

export const atsTechnicalTaskController = new ATSTechnicalTaskController(
  assignTechnicalTaskUseCase,
  updateTechnicalTaskUseCase,
  deleteTechnicalTaskUseCase,
  getTechnicalTasksByApplicationUseCase,
  s3Service,
  fileUrlService,
);

export const atsOfferController = new ATSOfferController(
  uploadOfferUseCase,
  updateOfferStatusUseCase,
  getOffersByApplicationUseCase,
  s3Service,
  fileUrlService,
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

export const atsActivityController = new ATSActivityController(
  getApplicationActivitiesPaginatedUseCase,
);

export const atsPipelineController = new ATSPipelineController(
  getJobPipelineUseCase,
  getJobApplicationsForKanbanUseCase,
  moveApplicationStageUseCase,
  updateApplicationSubStageUseCase,
  getCompanyIdByUserIdUseCase,
);


/**
 * Dependency Injection Type Identifiers
 * Used by InversifyJS to identify dependencies at runtime
 */
export const TYPES = {
  // Repositories
  UserRepository: Symbol.for('UserRepository'),
  OtpRepository: Symbol.for('OtpRepository'),
  AdminRepository: Symbol.for('AdminRepository'),
  SeekerProfileRepository: Symbol.for('SeekerProfileRepository'),
  CompanyProfileRepository: Symbol.for('CompanyProfileRepository'),
  JobPostingRepository: Symbol.for('JobPostingRepository'),
  JobApplicationRepository: Symbol.for('JobApplicationRepository'),
  ConversationRepository: Symbol.for('ConversationRepository'),
  ChatMessageRepository: Symbol.for('ChatMessageRepository'),


  // Use Cases - Auth
  LoginUserUseCase: Symbol.for('LoginUserUseCase'),
  AdminLoginUseCase: Symbol.for('AdminLoginUseCase'),
  GoogleLoginUseCase: Symbol.for('GoogleLoginUseCase'),
  RegisterUserUseCase: Symbol.for('RegisterUserUseCase'),
  VerifyOtpUseCase: Symbol.for('VerifyOtpUseCase'),
  ForgotPasswordUseCase: Symbol.for('ForgotPasswordUseCase'),
  ResetPasswordUseCase: Symbol.for('ResetPasswordUseCase'),
  RefreshTokenUseCase: Symbol.for('RefreshTokenUseCase'),

  // Use Cases - Chat
  SendMessageUseCase: Symbol.for('SendMessageUseCase'),
  GetConversationsUseCase: Symbol.for('GetConversationsUseCase'),
  GetMessagesUseCase: Symbol.for('GetMessagesUseCase'),
  MarkMessagesAsReadUseCase: Symbol.for('MarkMessagesAsReadUseCase'),
  CreateConversationUseCase: Symbol.for('CreateConversationUseCase'),
  DeleteMessageUseCase: Symbol.for('DeleteMessageUseCase'),

  // Controllers - Auth

  LoginController: Symbol.for('LoginController'),
  RegistrationController: Symbol.for('RegistrationController'),
  OtpController: Symbol.for('OtpController'),
  PasswordController: Symbol.for('PasswordController'),
  TokenController: Symbol.for('TokenController'),

  // Controllers - Chat
  ChatController: Symbol.for('ChatController'),

  // Services

  TokenService: Symbol.for('TokenService'),
  CookieService: Symbol.for('CookieService'),
  MailerService: Symbol.for('MailerService'),
  S3Service: Symbol.for('S3Service'),
  AiService: Symbol.for('AiService'),
  ResumeParserService: Symbol.for('ResumeParserService'),
  LoggerService: Symbol.for('LoggerService'),
  PasswordHasher: Symbol.for('PasswordHasher'),
  OtpService: Symbol.for('OtpService'),
  EmailTemplateService: Symbol.for('EmailTemplateService'),
  PasswordResetService: Symbol.for('PasswordResetService'),
  GoogleTokenVerifier: Symbol.for('GoogleTokenVerifier'),
  GetUserByIdUseCase: Symbol.for('GetUserByIdUseCase'),
  ChangePasswordUseCase: Symbol.for('ChangePasswordUseCase'),
  LogoutUseCase: Symbol.for('LogoutUseCase'),
  RequestOtpUseCase: Symbol.for('RequestOtpUseCase'),
  GetSeekerProfileUseCase: Symbol.for('GetSeekerProfileUseCase'),
  ChatSocketService: Symbol.for('ChatSocketService'),
  SocketConnectionManager: Symbol.for('SocketConnectionManager'),

  // Repositories - Admin extras
  CompanyVerificationRepository: Symbol.for('CompanyVerificationRepository'),
  JobCategoryRepository: Symbol.for('JobCategoryRepository'),
  SkillRepository: Symbol.for('SkillRepository'),
  JobRoleRepository: Symbol.for('JobRoleRepository'),
  SubscriptionPlanRepository: Symbol.for('SubscriptionPlanRepository'),
  CompanySubscriptionRepository: Symbol.for('CompanySubscriptionRepository'),
  PaymentOrderRepository: Symbol.for('PaymentOrderRepository'),
  PriceHistoryRepository: Symbol.for('PriceHistoryRepository'),
  CompanyContactRepository: Symbol.for('CompanyContactRepository'),
  CompanyOfficeLocationRepository: Symbol.for('CompanyOfficeLocationRepository'),
  CompanyTechStackRepository: Symbol.for('CompanyTechStackRepository'),
  CompanyBenefitsRepository: Symbol.for('CompanyBenefitsRepository'),
  CompanyWorkplacePicturesRepository: Symbol.for('CompanyWorkplacePicturesRepository'),

  // Use Cases - Admin Users
  GetAllUsersUseCase: Symbol.for('GetAllUsersUseCase'),
  BlockUserUseCase: Symbol.for('BlockUserUseCase'),
  AdminGetUserByIdUseCase: Symbol.for('AdminGetUserByIdUseCase'),

  // Use Cases - Admin Companies
  GetAllCompaniesUseCase: Symbol.for('GetAllCompaniesUseCase'),
  GetCompaniesWithVerificationUseCase: Symbol.for('GetCompaniesWithVerificationUseCase'),
  VerifyCompanyUseCase: Symbol.for('VerifyCompanyUseCase'),
  GetCompanyProfileUseCase: Symbol.for('GetCompanyProfileUseCase'),
  GetPendingCompaniesUseCase: Symbol.for('GetPendingCompaniesUseCase'),
  GetCompanyByIdUseCase: Symbol.for('GetCompanyByIdUseCase'),
  GetCompanyIdByUserIdUseCase: Symbol.for('GetCompanyIdByUserIdUseCase'),

  // Use Cases - Admin Jobs
  AdminGetAllJobsUseCase: Symbol.for('AdminGetAllJobsUseCase'),
  AdminGetJobByIdUseCase: Symbol.for('AdminGetJobByIdUseCase'),
  AdminUpdateJobStatusUseCase: Symbol.for('AdminUpdateJobStatusUseCase'),
  AdminDeleteJobUseCase: Symbol.for('AdminDeleteJobUseCase'),
  AdminGetJobStatsUseCase: Symbol.for('AdminGetJobStatsUseCase'),

  // Use Cases - Admin Attributes
  CreateJobCategoryUseCase: Symbol.for('CreateJobCategoryUseCase'),
  GetAllJobCategoriesUseCase: Symbol.for('GetAllJobCategoriesUseCase'),
  GetJobCategoryByIdUseCase: Symbol.for('GetJobCategoryByIdUseCase'),
  UpdateJobCategoryUseCase: Symbol.for('UpdateJobCategoryUseCase'),
  DeleteJobCategoryUseCase: Symbol.for('DeleteJobCategoryUseCase'),
  CreateSkillUseCase: Symbol.for('CreateSkillUseCase'),
  GetAllSkillsUseCase: Symbol.for('GetAllSkillsUseCase'),
  GetSkillByIdUseCase: Symbol.for('GetSkillByIdUseCase'),
  UpdateSkillUseCase: Symbol.for('UpdateSkillUseCase'),
  DeleteSkillUseCase: Symbol.for('DeleteSkillUseCase'),
  CreateJobRoleUseCase: Symbol.for('CreateJobRoleUseCase'),
  GetAllJobRolesUseCase: Symbol.for('GetAllJobRolesUseCase'),
  GetJobRoleByIdUseCase: Symbol.for('GetJobRoleByIdUseCase'),
  UpdateJobRoleUseCase: Symbol.for('UpdateJobRoleUseCase'),
  DeleteJobRoleUseCase: Symbol.for('DeleteJobRoleUseCase'),

  // Use Cases - Admin Subscription
  CreateSubscriptionPlanUseCase: Symbol.for('CreateSubscriptionPlanUseCase'),
  GetAllSubscriptionPlansUseCase: Symbol.for('GetAllSubscriptionPlansUseCase'),
  GetSubscriptionPlanByIdUseCase: Symbol.for('GetSubscriptionPlanByIdUseCase'),
  UpdateSubscriptionPlanUseCase: Symbol.for('UpdateSubscriptionPlanUseCase'),
  GetAllPaymentOrdersUseCase: Symbol.for('GetAllPaymentOrdersUseCase'),

  // Use Cases - Admin Dashboard
  GetAdminDashboardStatsUseCase: Symbol.for('GetAdminDashboardStatsUseCase'),

  // Controllers - Admin
  AdminUserController: Symbol.for('AdminUserController'),
  AdminCompanyController: Symbol.for('AdminCompanyController'),
  AdminJobController: Symbol.for('AdminJobController'),
  AdminJobCategoryController: Symbol.for('AdminJobCategoryController'),
  AdminSkillController: Symbol.for('AdminSkillController'),
  AdminJobRoleController: Symbol.for('AdminJobRoleController'),
  AdminSubscriptionPlanController: Symbol.for('AdminSubscriptionPlanController'),
  AdminPaymentOrderController: Symbol.for('AdminPaymentOrderController'),
  AdminDashboardController: Symbol.for('AdminDashboardController'),

  // Services - Admin extras
  NotificationService: Symbol.for('NotificationService'),
  StripeService: Symbol.for('StripeService'),

  // Repositories - Seeker
  SeekerExperienceRepository: Symbol.for('SeekerExperienceRepository'),
  SeekerEducationRepository: Symbol.for('SeekerEducationRepository'),
  ATSInterviewRepository: Symbol.for('ATSInterviewRepository'),
  ATSTechnicalTaskRepository: Symbol.for('ATSTechnicalTaskRepository'),
  ATSOfferRepository: Symbol.for('ATSOfferRepository'),
  ATSCompensationRepository: Symbol.for('ATSCompensationRepository'),
  ATSCompensationMeetingRepository: Symbol.for('ATSCompensationMeetingRepository'),
  ATSCommentRepository: Symbol.for('ATSCommentRepository'),

  // Services - Seeker
  AtsService: Symbol.for('AtsService'),
  FileUploadService: Symbol.for('FileUploadService'),

  // Use Cases - Seeker Profile
  CreateSeekerProfileUseCase: Symbol.for('CreateSeekerProfileUseCase'),
  UpdateSeekerProfileUseCase: Symbol.for('UpdateSeekerProfileUseCase'),
  AddExperienceUseCase: Symbol.for('AddExperienceUseCase'),
  GetExperiencesUseCase: Symbol.for('GetExperiencesUseCase'),
  UpdateExperienceUseCase: Symbol.for('UpdateExperienceUseCase'),
  RemoveExperienceUseCase: Symbol.for('RemoveExperienceUseCase'),
  AddEducationUseCase: Symbol.for('AddEducationUseCase'),
  GetEducationUseCase: Symbol.for('GetEducationUseCase'),
  UpdateEducationUseCase: Symbol.for('UpdateEducationUseCase'),
  RemoveEducationUseCase: Symbol.for('RemoveEducationUseCase'),
  UpdateSkillsUseCase: Symbol.for('UpdateSkillsUseCase'),
  UpdateLanguagesUseCase: Symbol.for('UpdateLanguagesUseCase'),
  UploadResumeUseCase: Symbol.for('UploadResumeUseCase'),
  RemoveResumeUseCase: Symbol.for('RemoveResumeUseCase'),
  UploadAvatarUseCase: Symbol.for('UploadAvatarUseCase'),
  UploadBannerUseCase: Symbol.for('UploadBannerUseCase'),

  // Use Cases - Applications
  CalculateATSScoreUseCase: Symbol.for('CalculateATSScoreUseCase'),
  CreateJobApplicationUseCase: Symbol.for('CreateJobApplicationUseCase'),
  GetApplicationsBySeekerUseCase: Symbol.for('GetApplicationsBySeekerUseCase'),
  GetSeekerApplicationDetailsUseCase: Symbol.for('GetSeekerApplicationDetailsUseCase'),
  AnalyzeResumeUseCase: Symbol.for('AnalyzeResumeUseCase'),
  GetInterviewsByApplicationUseCase: Symbol.for('GetInterviewsByApplicationUseCase'),
  GetTechnicalTasksByApplicationUseCase: Symbol.for('GetTechnicalTasksByApplicationUseCase'),
  SubmitTechnicalTaskUseCase: Symbol.for('SubmitTechnicalTaskUseCase'),
  GetOffersByApplicationUseCase: Symbol.for('GetOffersByApplicationUseCase'),
  GetCompensationByApplicationUseCase: Symbol.for('GetCompensationByApplicationUseCase'),
  GetCompensationMeetingsByApplicationUseCase: Symbol.for('GetCompensationMeetingsByApplicationUseCase'),
  UploadSignedOfferDocumentUseCase: Symbol.for('UploadSignedOfferDocumentUseCase'),
  UpdateApplicationSubStageUseCase: Symbol.for('UpdateApplicationSubStageUseCase'),
  UpdateOfferStatusUseCase: Symbol.for('UpdateOfferStatusUseCase'),

  // Controllers - Seeker
  SeekerProfileController: Symbol.for('SeekerProfileController'),
  SeekerJobApplicationController: Symbol.for('SeekerJobApplicationController'),

  // Use Cases - ATS
  ATS_ScheduleInterviewUseCase: Symbol.for('ATS_ScheduleInterviewUseCase'),
  ATS_UpdateInterviewUseCase: Symbol.for('ATS_UpdateInterviewUseCase'),
  ATS_GetInterviewsByApplicationUseCase: Symbol.for('ATS_GetInterviewsByApplicationUseCase'),
  ATS_AssignTechnicalTaskUseCase: Symbol.for('ATS_AssignTechnicalTaskUseCase'),
  ATS_UpdateTechnicalTaskUseCase: Symbol.for('ATS_UpdateTechnicalTaskUseCase'),
  ATS_DeleteTechnicalTaskUseCase: Symbol.for('ATS_DeleteTechnicalTaskUseCase'),
  ATS_GetTechnicalTasksByApplicationUseCase: Symbol.for('ATS_GetTechnicalTasksByApplicationUseCase'),
  ATS_UploadOfferUseCase: Symbol.for('ATS_UploadOfferUseCase'),
  ATS_UpdateOfferStatusUseCase: Symbol.for('ATS_UpdateOfferStatusUseCase'),
  ATS_GetOffersByApplicationUseCase: Symbol.for('ATS_GetOffersByApplicationUseCase'),
  ATS_AddCommentUseCase: Symbol.for('ATS_AddCommentUseCase'),
  ATS_GetCommentsByApplicationUseCase: Symbol.for('ATS_GetCommentsByApplicationUseCase'),
  ATS_MoveApplicationStageUseCase: Symbol.for('ATS_MoveApplicationStageUseCase'),
  ATS_GetJobATSPipelineUseCase: Symbol.for('ATS_GetJobATSPipelineUseCase'),
  ATS_GetJobApplicationsForKanbanUseCase: Symbol.for('ATS_GetJobApplicationsForKanbanUseCase'),
  ATS_InitiateCompensationUseCase: Symbol.for('ATS_InitiateCompensationUseCase'),
  ATS_UpdateCompensationUseCase: Symbol.for('ATS_UpdateCompensationUseCase'),
  ATS_GetCompensationUseCase: Symbol.for('ATS_GetCompensationUseCase'),
  ATS_ScheduleCompensationMeetingUseCase: Symbol.for('ATS_ScheduleCompensationMeetingUseCase'),
  ATS_GetCompensationMeetingsUseCase: Symbol.for('ATS_GetCompensationMeetingsUseCase'),
  ATS_UpdateCompensationMeetingStatusUseCase: Symbol.for('ATS_UpdateCompensationMeetingStatusUseCase'),

  // Controllers - ATS
  ATSInterviewController: Symbol.for('ATSInterviewController'),
  ATSTechnicalTaskController: Symbol.for('ATSTechnicalTaskController'),
  ATSOfferController: Symbol.for('ATSOfferController'),
  ATSCommentController: Symbol.for('ATSCommentController'),
  ATSCompensationController: Symbol.for('ATSCompensationController'),
  ATSPipelineController: Symbol.for('ATSPipelineController'),

  // Notification
  NotificationRepository: Symbol.for('NotificationRepository'),
  CreateNotificationUseCase: Symbol.for('CreateNotificationUseCase'),
  GetNotificationsUseCase: Symbol.for('GetNotificationsUseCase'),
  MarkNotificationAsReadUseCase: Symbol.for('MarkNotificationAsReadUseCase'),
  MarkAllNotificationsAsReadUseCase: Symbol.for('MarkAllNotificationsAsReadUseCase'),
  GetUnreadNotificationCountUseCase: Symbol.for('GetUnreadNotificationCountUseCase'),
  NotificationController: Symbol.for('NotificationController'),
  NotificationRouter: Symbol.for('NotificationRouter'),

  // Public listings & attributes
  GetAllJobPostingsUseCase: Symbol.for('GetAllJobPostingsUseCase'),
  GetJobPostingForPublicUseCase: Symbol.for('GetJobPostingForPublicUseCase'),
  GetFeaturedJobsUseCase: Symbol.for('GetFeaturedJobsUseCase'),
  GetPublicSkillsUseCase: Symbol.for('GetPublicSkillsUseCase'),
  GetPublicJobCategoriesUseCase: Symbol.for('GetPublicJobCategoriesUseCase'),
  GetPublicJobRolesUseCase: Symbol.for('GetPublicJobRolesUseCase'),
  GetSeekerCompaniesUseCase: Symbol.for('GetSeekerCompaniesUseCase'),
  GetPublicCompanyProfileUseCase: Symbol.for('GetPublicCompanyProfileUseCase'),
  PublicJobController: Symbol.for('PublicJobController'),
  PublicDataController: Symbol.for('PublicDataController'),

  // Company — profile & admin helper
  CreateCompanyProfileUseCase: Symbol.for('CreateCompanyProfileUseCase'),
  CreateCompanyProfileFromDtoUseCase: Symbol.for('CreateCompanyProfileFromDtoUseCase'),
  UpdateCompanyProfileUseCase: Symbol.for('UpdateCompanyProfileUseCase'),
  GetCompanyProfileWithJobPostingsUseCase: Symbol.for('GetCompanyProfileWithJobPostingsUseCase'),
  ReapplyCompanyVerificationUseCase: Symbol.for('ReapplyCompanyVerificationUseCase'),
  GetCompanyContactUseCase: Symbol.for('GetCompanyContactUseCase'),
  UpsertCompanyContactUseCase: Symbol.for('UpsertCompanyContactUseCase'),
  GetCompanyProfileByUserIdUseCase: Symbol.for('GetCompanyProfileByUserIdUseCase'),
  CreateCompanyTechStackUseCase: Symbol.for('CreateCompanyTechStackUseCase'),
  UpdateCompanyTechStackUseCase: Symbol.for('UpdateCompanyTechStackUseCase'),
  DeleteCompanyTechStackUseCase: Symbol.for('DeleteCompanyTechStackUseCase'),
  GetCompanyTechStackUseCase: Symbol.for('GetCompanyTechStackUseCase'),
  CreateCompanyOfficeLocationUseCase: Symbol.for('CreateCompanyOfficeLocationUseCase'),
  UpdateCompanyOfficeLocationUseCase: Symbol.for('UpdateCompanyOfficeLocationUseCase'),
  DeleteCompanyOfficeLocationUseCase: Symbol.for('DeleteCompanyOfficeLocationUseCase'),
  GetCompanyOfficeLocationUseCase: Symbol.for('GetCompanyOfficeLocationUseCase'),
  CreateCompanyBenefitUseCase: Symbol.for('CreateCompanyBenefitUseCase'),
  UpdateCompanyBenefitUseCase: Symbol.for('UpdateCompanyBenefitUseCase'),
  DeleteCompanyBenefitUseCase: Symbol.for('DeleteCompanyBenefitUseCase'),
  GetCompanyBenefitUseCase: Symbol.for('GetCompanyBenefitUseCase'),
  CreateCompanyWorkplacePictureUseCase: Symbol.for('CreateCompanyWorkplacePictureUseCase'),
  UpdateCompanyWorkplacePictureUseCase: Symbol.for('UpdateCompanyWorkplacePictureUseCase'),
  DeleteCompanyWorkplacePictureUseCase: Symbol.for('DeleteCompanyWorkplacePictureUseCase'),
  GetCompanyWorkplacePictureUseCase: Symbol.for('GetCompanyWorkplacePictureUseCase'),
  UploadLogoUseCase: Symbol.for('UploadLogoUseCase'),
  UploadBusinessLicenseUseCase: Symbol.for('UploadBusinessLicenseUseCase'),
  UploadWorkplacePictureUseCase: Symbol.for('UploadWorkplacePictureUseCase'),
  DeleteImageUseCase: Symbol.for('DeleteImageUseCase'),

  // Company — jobs & hiring
  CreateJobPostingUseCase: Symbol.for('CreateJobPostingUseCase'),
  GetCompanyJobPostingUseCase: Symbol.for('GetCompanyJobPostingUseCase'),
  GetCompanyJobPostingsUseCase: Symbol.for('GetCompanyJobPostingsUseCase'),
  UpdateJobPostingUseCase: Symbol.for('UpdateJobPostingUseCase'),
  DeleteJobPostingUseCase: Symbol.for('DeleteJobPostingUseCase'),
  UpdateJobStatusUseCase: Symbol.for('UpdateJobStatusUseCase'),
  GetApplicationsByJobUseCase: Symbol.for('GetApplicationsByJobUseCase'),
  GetApplicationsByCompanyUseCase: Symbol.for('GetApplicationsByCompanyUseCase'),
  GetCompanyApplicationDetailsUseCase: Symbol.for('GetCompanyApplicationDetailsUseCase'),
  CompanyUpdateApplicationStageUseCase: Symbol.for('CompanyUpdateApplicationStageUseCase'),
  UpdateApplicationScoreUseCase: Symbol.for('UpdateApplicationScoreUseCase'),
  BulkUpdateApplicationsUseCase: Symbol.for('BulkUpdateApplicationsUseCase'),
  GetCandidatesUseCase: Symbol.for('GetCandidatesUseCase'),
  GetCandidateDetailsUseCase: Symbol.for('GetCandidateDetailsUseCase'),
  MarkCandidateHiredUseCase: Symbol.for('MarkCandidateHiredUseCase'),
  CloseJobManuallyUseCase: Symbol.for('CloseJobManuallyUseCase'),
  ReopenJobUseCase: Symbol.for('ReopenJobUseCase'),
  ToggleFeaturedJobUseCase: Symbol.for('ToggleFeaturedJobUseCase'),
  GetCompanyDashboardStatsUseCase: Symbol.for('GetCompanyDashboardStatsUseCase'),

  // Company — subscription & billing
  GetActiveSubscriptionUseCase: Symbol.for('GetActiveSubscriptionUseCase'),
  GetPaymentHistoryUseCase: Symbol.for('GetPaymentHistoryUseCase'),
  CreateCheckoutSessionUseCase: Symbol.for('CreateCheckoutSessionUseCase'),
  RevertToDefaultPlanUseCase: Symbol.for('RevertToDefaultPlanUseCase'),
  HandleStripeWebhookUseCase: Symbol.for('HandleStripeWebhookUseCase'),
  CancelSubscriptionUseCase: Symbol.for('CancelSubscriptionUseCase'),
  ResumeSubscriptionUseCase: Symbol.for('ResumeSubscriptionUseCase'),
  ChangeSubscriptionPlanUseCase: Symbol.for('ChangeSubscriptionPlanUseCase'),
  PreviewPlanChangeUseCase: Symbol.for('PreviewPlanChangeUseCase'),
  GetBillingPortalUseCase: Symbol.for('GetBillingPortalUseCase'),

  // Company — controllers & middleware
  CompanyProfileController: Symbol.for('CompanyProfileController'),
  CompanyContactController: Symbol.for('CompanyContactController'),
  CompanyTechStackController: Symbol.for('CompanyTechStackController'),
  CompanyOfficeLocationController: Symbol.for('CompanyOfficeLocationController'),
  CompanyBenefitController: Symbol.for('CompanyBenefitController'),
  CompanyWorkplacePictureController: Symbol.for('CompanyWorkplacePictureController'),
  CompanyUploadController: Symbol.for('CompanyUploadController'),
  CompanyJobPostingController: Symbol.for('CompanyJobPostingController'),
  CompanyJobApplicationController: Symbol.for('CompanyJobApplicationController'),
  CompanySubscriptionPlanController: Symbol.for('CompanySubscriptionPlanController'),
  CompanySubscriptionController: Symbol.for('CompanySubscriptionController'),
  CompanyCandidatesController: Symbol.for('CompanyCandidatesController'),
  CompanyDashboardController: Symbol.for('CompanyDashboardController'),
  StripeWebhookController: Symbol.for('StripeWebhookController'),
  SubscriptionMiddleware: Symbol.for('SubscriptionMiddleware'),
} as const;






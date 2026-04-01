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
  GetPendingCompaniesUseCase: Symbol.for('GetPendingCompaniesUseCase'),
  GetCompanyByIdUseCase: Symbol.for('GetCompanyByIdUseCase'),

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
} as const;






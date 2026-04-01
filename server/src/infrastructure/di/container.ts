import { Container } from 'inversify';
import { TYPES } from 'src/shared/constants/types';

// Repositories
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { UserRepository } from 'src/infrastructure/persistence/mongodb/repositories/user.repository';

// Services
import { ITokenService } from 'src/domain/interfaces/services/ITokenService';
import { JwtTokenService } from 'src/infrastructure/security/jwt-token-service';
import { IPasswordHasher } from 'src/domain/interfaces/services/IPasswordHasher';
import { BcryptPasswordHasher } from 'src/infrastructure/security/bcrypt-password-hasher';
import { IMailerService } from 'src/domain/interfaces/services/IMailerService';
import { NodemailerService } from 'src/infrastructure/messaging/mailer';
import { IEmailTemplateService } from 'src/domain/interfaces/services/IEmailTemplateService';
import { EmailTemplateService } from 'src/infrastructure/messaging/email-template.service';
import { IOtpService } from 'src/domain/interfaces/services/IOtpService';
import { RedisOtpService } from 'src/infrastructure/persistence/redis/services/redis-otp-service';
import { IPasswordResetService } from 'src/domain/interfaces/services/IPasswordResetService';
import { PasswordResetServiceImpl } from 'src/infrastructure/security/password-reset-service';
import { IGoogleTokenVerifier } from 'src/domain/interfaces/services/IGoogleTokenVerifier';
import { GoogleAuthTokenVerifier } from 'src/infrastructure/security/google-token-verifier';
import { ICookieService } from 'src/presentation/services/ICookieService';
import { CookieService } from 'src/infrastructure/http/cookie.service';

// Use Cases
import { ILoginUserUseCase } from 'src/domain/interfaces/use-cases/auth/session/ILoginUserUseCase';
import { LoginUserUseCase } from 'src/application/use-cases/auth/session/login-user.use-case';
import { IAdminLoginUseCase } from 'src/domain/interfaces/use-cases/auth/session/IAdminLoginUseCase';
import { AdminLoginUseCase } from 'src/application/use-cases/auth/session/admin-login.use-case';
import { IGoogleLoginUseCase } from 'src/domain/interfaces/use-cases/auth/session/IGoogleLoginUseCase';
import { GoogleLoginUseCase } from 'src/application/use-cases/auth/session/google-login.use-case';
import { IRegisterUserUseCase } from 'src/domain/interfaces/use-cases/auth/registration/IRegisterUserUseCase';
import { RegisterUserUseCase } from 'src/application/use-cases/auth/registration/register-user.use-case';
import { IForgotPasswordUseCase } from 'src/domain/interfaces/use-cases/auth/password/IForgotPasswordUseCase';
import { ForgotPasswordUseCase } from 'src/application/use-cases/auth/password/forgot-password.use-case';
import { IResetPasswordUseCase } from 'src/domain/interfaces/use-cases/auth/password/IResetPasswordUseCase';
import { ResetPasswordUseCase } from 'src/application/use-cases/auth/password/reset-password.use-case';
import { IChangePasswordUseCase } from 'src/domain/interfaces/use-cases/auth/password/IChangePasswordUseCase';
import { ChangePasswordUseCase } from 'src/application/use-cases/auth/password/change-password.use-case';
import { IRequestOtpUseCase } from 'src/domain/interfaces/use-cases/auth/verification/IRequestOtpUseCase';
import { RequestOtpUseCase } from 'src/application/use-cases/auth/verification/request-otp.use-case';
import { IVerifyOtpUseCase } from 'src/domain/interfaces/use-cases/auth/verification/IVerifyOtpUseCase';
import { VerifyOtpUseCase } from 'src/application/use-cases/auth/verification/verify-otp.use-case';
import { IRefreshTokenUseCase } from 'src/domain/interfaces/use-cases/auth/session/IRefreshTokenUseCase';
import { RefreshTokenUseCase } from 'src/application/use-cases/auth/session/refresh-token.use-case';
import { ILogoutUseCase } from 'src/domain/interfaces/use-cases/auth/session/ILogoutUseCase';
import { LogoutUseCase } from 'src/application/use-cases/auth/session/logout.use-case';
import { IAuthGetUserByIdUseCase } from 'src/domain/interfaces/use-cases/auth/user/IAuthGetUserByIdUseCase';
import { GetUserByIdUseCase } from 'src/application/use-cases/admin/user/get-user-by-id.use-case';
import { getSeekerProfileUseCase } from 'src/infrastructure/di/seekerDi';
import { IGetSeekerProfileUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/info/IGetSeekerProfileUseCase';

// Controllers
import { LoginController } from 'src/presentation/controllers/auth/login.controller';
import { RegistrationController } from 'src/presentation/controllers/auth/registration.controller';
import { OtpController } from 'src/presentation/controllers/auth/otp.controller';
import { TokenController } from 'src/presentation/controllers/auth/token.controller';
import { PasswordController } from 'src/presentation/controllers/auth/password.controller';

// Chat Module Imports
import { IConversationRepository } from 'src/domain/interfaces/repositories/chat/IConversationRepository';
import { ConversationRepository } from 'src/infrastructure/persistence/mongodb/repositories/conversation.repository';
import { IMessageRepository } from 'src/domain/interfaces/repositories/chat/IMessageRepository';
import { ChatMessageRepository } from 'src/infrastructure/persistence/mongodb/repositories/chat-message.repository';
import { IS3Service } from 'src/domain/interfaces/services/IS3Service';
import { S3Service } from 'src/infrastructure/external-services/s3/s3.service';
import { IChatSocketService } from 'src/domain/interfaces/services/IChatSocketService';
import { ISocketConnectionManager } from 'src/domain/interfaces/services/ISocketConnectionManager';
import { ChatSocketService } from 'src/infrastructure/external-services/socket/chat.service';
import { ICreateConversationUseCase } from 'src/domain/interfaces/use-cases/chat/ICreateConversationUseCase';
import { CreateConversationUseCase } from 'src/application/use-cases/chat/create-conversation.use-case';
import { ISendMessageUseCase } from 'src/domain/interfaces/use-cases/chat/ISendMessageUseCase';
import { SendMessageUseCase } from 'src/application/use-cases/chat/send-message.use-case';
import { IGetConversationsUseCase } from 'src/domain/interfaces/use-cases/chat/IGetConversationsUseCase';
import { GetConversationsUseCase } from 'src/application/use-cases/chat/get-conversations.use-case';
import { IGetMessagesUseCase } from 'src/domain/interfaces/use-cases/chat/IGetMessagesUseCase';
import { GetMessagesUseCase } from 'src/application/use-cases/chat/get-messages.use-case';
import { IMarkMessagesAsReadUseCase } from 'src/domain/interfaces/use-cases/chat/IMarkMessagesAsReadUseCase';
import { MarkMessagesAsReadUseCase } from 'src/application/use-cases/chat/mark-messages-as-read.use-case';
import { IDeleteMessageUseCase } from 'src/domain/interfaces/use-cases/chat/IDeleteMessageUseCase';
import { DeleteMessageUseCase } from 'src/application/use-cases/chat/delete-message.use-case';
import { ChatController } from 'src/presentation/controllers/chat/chat.controller';

// Admin Module Imports
import { CompanyProfileRepository } from 'src/infrastructure/persistence/mongodb/repositories/company-profile.repository';
import { CompanyVerificationRepository } from 'src/infrastructure/persistence/mongodb/repositories/company-verification.repository';
import { JobPostingRepository } from 'src/infrastructure/persistence/mongodb/repositories/job-posting.repository';
import { JobCategoryRepository } from 'src/infrastructure/persistence/mongodb/repositories/job-category.repository';
import { SkillRepository } from 'src/infrastructure/persistence/mongodb/repositories/skill.repository';
import { JobRoleRepository } from 'src/infrastructure/persistence/mongodb/repositories/job-role.repository';
import { SubscriptionPlanRepository } from 'src/infrastructure/persistence/mongodb/repositories/subscription-plan.repository';
import { CompanySubscriptionRepository } from 'src/infrastructure/persistence/mongodb/repositories/company-subscription.repository';
import { PaymentOrderRepository } from 'src/infrastructure/persistence/mongodb/repositories/payment-order.repository';
import { SeekerProfileRepository } from 'src/infrastructure/persistence/mongodb/repositories/seeker-profile.repository';
import { PriceHistoryRepository } from 'src/infrastructure/persistence/mongodb/repositories/price-history.repository';
import { CompanyContactRepository } from 'src/infrastructure/persistence/mongodb/repositories/company-contact.repository';
import { CompanyOfficeLocationRepository } from 'src/infrastructure/persistence/mongodb/repositories/company-office-location.repository';
import { CompanyTechStackRepository } from 'src/infrastructure/persistence/mongodb/repositories/company-tech-stack.repository';
import { CompanyBenefitsRepository } from 'src/infrastructure/persistence/mongodb/repositories/company-benefits.repository';
import { CompanyWorkplacePicturesRepository } from 'src/infrastructure/persistence/mongodb/repositories/company-workplace-pictures.repository';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ICompanyVerificationRepository } from 'src/domain/interfaces/repositories/company/ICompanyVerificationRepository';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { ISeekerProfileRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { IPaymentOrderRepository } from 'src/domain/interfaces/repositories/payment/IPaymentOrderRepository';
import { ISubscriptionPlanRepository } from 'src/domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { ICompanySubscriptionRepository } from 'src/domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { IPriceHistoryRepository } from 'src/domain/interfaces/repositories/price-history/IPriceHistoryRepository';
import { ICompanyContactRepository } from 'src/domain/interfaces/repositories/company/ICompanyContactRepository';
import { ICompanyOfficeLocationRepository } from 'src/domain/interfaces/repositories/company/ICompanyOfficeLocationRepository';
import { ICompanyTechStackRepository } from 'src/domain/interfaces/repositories/company/ICompanyTechStackRepository';
import { ICompanyBenefitsRepository } from 'src/domain/interfaces/repositories/company/ICompanyBenefitsRepository';
import { ICompanyWorkplacePicturesRepository } from 'src/domain/interfaces/repositories/company/ICompanyWorkplacePicturesRepository';
import { ILogger } from 'src/domain/interfaces/services/ILogger';
import { logger } from 'src/infrastructure/config/logger';
import { IStripeService } from 'src/domain/interfaces/services/IStripeService';
import { INotificationService } from 'src/domain/interfaces/services/INotificationService';
import { notificationService } from 'src/infrastructure/di/notificationDi';
import { stripeService } from 'src/infrastructure/di/companyDi';
// Admin Use Cases
import { GetAllUsersUseCase } from 'src/application/use-cases/admin/user/get-all-users.use-case';
import { BlockUserUseCase } from 'src/application/use-cases/admin/user/block-user.use-case';
import { GetUserByIdUseCase as AdminGetUserByIdUseCase } from 'src/application/use-cases/admin/user/get-user-by-id.use-case';
import { GetAllCompaniesUseCase } from 'src/application/use-cases/admin/companies/get-all-companies.use-case';
import { GetCompaniesWithVerificationUseCase } from 'src/application/use-cases/admin/companies/get-companies-with-verification.use-case';
import { VerifyCompanyUseCase } from 'src/application/use-cases/admin/companies/verify-company.use-case';
import { GetPendingCompaniesUseCase } from 'src/application/use-cases/admin/companies/get-pending-companies.use-case';
import { GetCompanyByIdUseCase } from 'src/application/use-cases/admin/companies/get-company-by-id.use-case';
import { GetAllJobsUseCase } from 'src/application/use-cases/admin/job/get-all-jobs.use-case';
import { AdminGetJobByIdUseCase } from 'src/application/use-cases/admin/job/get-job-by-id.use-case';
import { AdminUpdateJobStatusUseCase } from 'src/application/use-cases/admin/job/update-job-status.use-case';
import { AdminDeleteJobUseCase } from 'src/application/use-cases/admin/job/delete-job.use-case';
import { AdminGetJobStatsUseCase } from 'src/application/use-cases/admin/analytics/get-job-stats.use-case';
import { CreateJobCategoryUseCase } from 'src/application/use-cases/admin/attributes/job-categorys/create-job-category.use-case';
import { GetAllJobCategoriesUseCase } from 'src/application/use-cases/admin/attributes/job-categorys/get-all-job-categories.use-case';
import { GetJobCategoryByIdUseCase } from 'src/application/use-cases/admin/attributes/job-categorys/get-job-category-by-id.use-case';
import { UpdateJobCategoryUseCase } from 'src/application/use-cases/admin/attributes/job-categorys/update-job-category.use-case';
import { DeleteJobCategoryUseCase } from 'src/application/use-cases/admin/attributes/job-categorys/delete-job-category.use-case';
import { CreateSkillUseCase } from 'src/application/use-cases/admin/attributes/skills/create-skill.use-case';
import { GetAllSkillsUseCase } from 'src/application/use-cases/admin/attributes/skills/get-all-skills.use-case';
import { GetSkillByIdUseCase } from 'src/application/use-cases/admin/attributes/skills/get-skill-by-id.use-case';
import { UpdateSkillUseCase } from 'src/application/use-cases/admin/attributes/skills/update-skill.use-case';
import { DeleteSkillUseCase } from 'src/application/use-cases/admin/attributes/skills/delete-skill.use-case';
import { CreateJobRoleUseCase } from 'src/application/use-cases/admin/attributes/job-roles/create-job-role.use-case';
import { GetAllJobRolesUseCase } from 'src/application/use-cases/admin/attributes/job-roles/get-all-job-roles.use-case';
import { GetJobRoleByIdUseCase } from 'src/application/use-cases/admin/attributes/job-roles/get-job-role-by-id.use-case';
import { UpdateJobRoleUseCase } from 'src/application/use-cases/admin/attributes/job-roles/update-job-role.use-case';
import { DeleteJobRoleUseCase } from 'src/application/use-cases/admin/attributes/job-roles/delete-job-role.use-case';
import { CreateSubscriptionPlanUseCase } from 'src/application/use-cases/admin/subscription/create-subscription-plan.use-case';
import { GetAllSubscriptionPlansUseCase } from 'src/application/use-cases/admin/subscription/get-all-subscription-plans.use-case';
import { GetSubscriptionPlanByIdUseCase } from 'src/application/use-cases/admin/subscription/get-subscription-plan-by-id.use-case';
import { UpdateSubscriptionPlanUseCase } from 'src/application/use-cases/admin/subscription/update-subscription-plan.use-case';
import { GetAllPaymentOrdersUseCase } from 'src/application/use-cases/admin/payments/get-all-payment-orders.use-case';
import { GetAdminDashboardStatsUseCase } from 'src/application/use-cases/admin/dashboard/get-admin-dashboard-stats.use-case';
// Admin Controllers
import { AdminUserController } from 'src/presentation/controllers/admin/admin-user.controller';
import { AdminCompanyController } from 'src/presentation/controllers/admin/admin-company.controller';
import { AdminJobController } from 'src/presentation/controllers/admin/admin-job.controller';
import { AdminJobCategoryController } from 'src/presentation/controllers/admin/admin-job-category.controller';
import { AdminSkillController } from 'src/presentation/controllers/admin/admin-skill.controller';
import { AdminJobRoleController } from 'src/presentation/controllers/admin/admin-job-role.controller';
import { AdminSubscriptionPlanController } from 'src/presentation/controllers/admin/admin-subscription-plan.controller';
import { AdminPaymentOrderController } from 'src/presentation/controllers/admin/admin-payment-order.controller';
import { AdminDashboardController } from 'src/presentation/controllers/admin/admin-dashboard.controller';

const container = new Container();

// Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IConversationRepository>(TYPES.ConversationRepository).to(ConversationRepository);
container.bind<IMessageRepository>(TYPES.ChatMessageRepository).to(ChatMessageRepository);
container.bind<ICompanyProfileRepository>(TYPES.CompanyProfileRepository).to(CompanyProfileRepository);
container.bind<ICompanyVerificationRepository>(TYPES.CompanyVerificationRepository).to(CompanyVerificationRepository);
container.bind<IJobPostingRepository>(TYPES.JobPostingRepository).to(JobPostingRepository);
container.bind<ISeekerProfileRepository>(TYPES.SeekerProfileRepository).to(SeekerProfileRepository);
container.bind<IPaymentOrderRepository>(TYPES.PaymentOrderRepository).to(PaymentOrderRepository);
container.bind<ISubscriptionPlanRepository>(TYPES.SubscriptionPlanRepository).to(SubscriptionPlanRepository);
container.bind<ICompanySubscriptionRepository>(TYPES.CompanySubscriptionRepository).to(CompanySubscriptionRepository);
container.bind<IPriceHistoryRepository>(TYPES.PriceHistoryRepository).to(PriceHistoryRepository);
container.bind<ICompanyContactRepository>(TYPES.CompanyContactRepository).to(CompanyContactRepository);
container.bind<ICompanyOfficeLocationRepository>(TYPES.CompanyOfficeLocationRepository).to(CompanyOfficeLocationRepository);
container.bind<ICompanyTechStackRepository>(TYPES.CompanyTechStackRepository).to(CompanyTechStackRepository);
container.bind<ICompanyBenefitsRepository>(TYPES.CompanyBenefitsRepository).to(CompanyBenefitsRepository);
container.bind<ICompanyWorkplacePicturesRepository>(TYPES.CompanyWorkplacePicturesRepository).to(CompanyWorkplacePicturesRepository);
// Attribute Repositories
container.bind<JobCategoryRepository>(TYPES.JobCategoryRepository).to(JobCategoryRepository);
container.bind<SkillRepository>(TYPES.SkillRepository).to(SkillRepository);
container.bind<JobRoleRepository>(TYPES.JobRoleRepository).to(JobRoleRepository);

// Services
container.bind<ITokenService>(TYPES.TokenService).to(JwtTokenService);
container.bind<IPasswordHasher>(TYPES.PasswordHasher).to(BcryptPasswordHasher);
container.bind<IMailerService>(TYPES.MailerService).to(NodemailerService);
container.bind<IEmailTemplateService>(TYPES.EmailTemplateService).to(EmailTemplateService);
container.bind<IOtpService>(TYPES.OtpService).to(RedisOtpService);
container.bind<IPasswordResetService>(TYPES.PasswordResetService).to(PasswordResetServiceImpl);
container.bind<IGoogleTokenVerifier>(TYPES.GoogleTokenVerifier).to(GoogleAuthTokenVerifier);
container.bind<ICookieService>(TYPES.CookieService).to(CookieService);
container.bind<IS3Service>(TYPES.S3Service).to(S3Service);
container.bind<ChatSocketService>(TYPES.ChatSocketService).to(ChatSocketService).inSingletonScope();
container.bind<ISocketConnectionManager>(TYPES.SocketConnectionManager).toDynamicValue((context) => context.container.get(TYPES.ChatSocketService));
container.bind<ILogger>(TYPES.LoggerService).toConstantValue(logger);
container.bind<INotificationService>(TYPES.NotificationService).toConstantValue(notificationService as unknown as INotificationService);
container.bind<IStripeService>(TYPES.StripeService).toConstantValue(stripeService as unknown as IStripeService);

// Use Cases
container.bind<IGetSeekerProfileUseCase>(TYPES.GetSeekerProfileUseCase).toConstantValue(getSeekerProfileUseCase);
container.bind<ILoginUserUseCase>(TYPES.LoginUserUseCase).to(LoginUserUseCase);
container.bind<IAdminLoginUseCase>(TYPES.AdminLoginUseCase).to(AdminLoginUseCase);
container.bind<IGoogleLoginUseCase>(TYPES.GoogleLoginUseCase).to(GoogleLoginUseCase);
container.bind<IRegisterUserUseCase>(TYPES.RegisterUserUseCase).to(RegisterUserUseCase);
container.bind<IForgotPasswordUseCase>(TYPES.ForgotPasswordUseCase).to(ForgotPasswordUseCase);
container.bind<IResetPasswordUseCase>(TYPES.ResetPasswordUseCase).to(ResetPasswordUseCase);
container.bind<IChangePasswordUseCase>(TYPES.ChangePasswordUseCase).to(ChangePasswordUseCase);
container.bind<IRequestOtpUseCase>(TYPES.RequestOtpUseCase).to(RequestOtpUseCase);
container.bind<IVerifyOtpUseCase>(TYPES.VerifyOtpUseCase).to(VerifyOtpUseCase);
container.bind<IRefreshTokenUseCase>(TYPES.RefreshTokenUseCase).to(RefreshTokenUseCase);
container.bind<ILogoutUseCase>(TYPES.LogoutUseCase).to(LogoutUseCase);
container.bind<IAuthGetUserByIdUseCase>(TYPES.GetUserByIdUseCase).to(GetUserByIdUseCase);
container.bind<ICreateConversationUseCase>(TYPES.CreateConversationUseCase).to(CreateConversationUseCase);
container.bind<ISendMessageUseCase>(TYPES.SendMessageUseCase).to(SendMessageUseCase);
container.bind<IGetConversationsUseCase>(TYPES.GetConversationsUseCase).to(GetConversationsUseCase);
container.bind<IGetMessagesUseCase>(TYPES.GetMessagesUseCase).to(GetMessagesUseCase);
container.bind<IMarkMessagesAsReadUseCase>(TYPES.MarkMessagesAsReadUseCase).to(MarkMessagesAsReadUseCase);
container.bind<IDeleteMessageUseCase>(TYPES.DeleteMessageUseCase).to(DeleteMessageUseCase);
// Admin Use Cases
container.bind<GetAllUsersUseCase>(TYPES.GetAllUsersUseCase).to(GetAllUsersUseCase);
container.bind<BlockUserUseCase>(TYPES.BlockUserUseCase).to(BlockUserUseCase);
container.bind<AdminGetUserByIdUseCase>(TYPES.AdminGetUserByIdUseCase).to(AdminGetUserByIdUseCase);
container.bind<GetAllCompaniesUseCase>(TYPES.GetAllCompaniesUseCase).to(GetAllCompaniesUseCase);
container.bind<GetCompaniesWithVerificationUseCase>(TYPES.GetCompaniesWithVerificationUseCase).to(GetCompaniesWithVerificationUseCase);
container.bind<VerifyCompanyUseCase>(TYPES.VerifyCompanyUseCase).to(VerifyCompanyUseCase);
container.bind<GetPendingCompaniesUseCase>(TYPES.GetPendingCompaniesUseCase).to(GetPendingCompaniesUseCase);
container.bind<GetCompanyByIdUseCase>(TYPES.GetCompanyByIdUseCase).to(GetCompanyByIdUseCase);
container.bind<GetAllJobsUseCase>(TYPES.AdminGetAllJobsUseCase).to(GetAllJobsUseCase);
container.bind<AdminGetJobByIdUseCase>(TYPES.AdminGetJobByIdUseCase).to(AdminGetJobByIdUseCase);
container.bind<AdminUpdateJobStatusUseCase>(TYPES.AdminUpdateJobStatusUseCase).to(AdminUpdateJobStatusUseCase);
container.bind<AdminDeleteJobUseCase>(TYPES.AdminDeleteJobUseCase).to(AdminDeleteJobUseCase);
container.bind<AdminGetJobStatsUseCase>(TYPES.AdminGetJobStatsUseCase).to(AdminGetJobStatsUseCase);
container.bind<CreateJobCategoryUseCase>(TYPES.CreateJobCategoryUseCase).to(CreateJobCategoryUseCase);
container.bind<GetAllJobCategoriesUseCase>(TYPES.GetAllJobCategoriesUseCase).to(GetAllJobCategoriesUseCase);
container.bind<GetJobCategoryByIdUseCase>(TYPES.GetJobCategoryByIdUseCase).to(GetJobCategoryByIdUseCase);
container.bind<UpdateJobCategoryUseCase>(TYPES.UpdateJobCategoryUseCase).to(UpdateJobCategoryUseCase);
container.bind<DeleteJobCategoryUseCase>(TYPES.DeleteJobCategoryUseCase).to(DeleteJobCategoryUseCase);
container.bind<CreateSkillUseCase>(TYPES.CreateSkillUseCase).to(CreateSkillUseCase);
container.bind<GetAllSkillsUseCase>(TYPES.GetAllSkillsUseCase).to(GetAllSkillsUseCase);
container.bind<GetSkillByIdUseCase>(TYPES.GetSkillByIdUseCase).to(GetSkillByIdUseCase);
container.bind<UpdateSkillUseCase>(TYPES.UpdateSkillUseCase).to(UpdateSkillUseCase);
container.bind<DeleteSkillUseCase>(TYPES.DeleteSkillUseCase).to(DeleteSkillUseCase);
container.bind<CreateJobRoleUseCase>(TYPES.CreateJobRoleUseCase).to(CreateJobRoleUseCase);
container.bind<GetAllJobRolesUseCase>(TYPES.GetAllJobRolesUseCase).to(GetAllJobRolesUseCase);
container.bind<GetJobRoleByIdUseCase>(TYPES.GetJobRoleByIdUseCase).to(GetJobRoleByIdUseCase);
container.bind<UpdateJobRoleUseCase>(TYPES.UpdateJobRoleUseCase).to(UpdateJobRoleUseCase);
container.bind<DeleteJobRoleUseCase>(TYPES.DeleteJobRoleUseCase).to(DeleteJobRoleUseCase);
container.bind<CreateSubscriptionPlanUseCase>(TYPES.CreateSubscriptionPlanUseCase).to(CreateSubscriptionPlanUseCase);
container.bind<GetAllSubscriptionPlansUseCase>(TYPES.GetAllSubscriptionPlansUseCase).to(GetAllSubscriptionPlansUseCase);
container.bind<GetSubscriptionPlanByIdUseCase>(TYPES.GetSubscriptionPlanByIdUseCase).to(GetSubscriptionPlanByIdUseCase);
container.bind<UpdateSubscriptionPlanUseCase>(TYPES.UpdateSubscriptionPlanUseCase).to(UpdateSubscriptionPlanUseCase);
container.bind<GetAllPaymentOrdersUseCase>(TYPES.GetAllPaymentOrdersUseCase).to(GetAllPaymentOrdersUseCase);
container.bind<GetAdminDashboardStatsUseCase>(TYPES.GetAdminDashboardStatsUseCase).to(GetAdminDashboardStatsUseCase);


// Controllers
container.bind<LoginController>(TYPES.LoginController).to(LoginController);
container.bind<RegistrationController>(TYPES.RegistrationController).to(RegistrationController);
container.bind<OtpController>(TYPES.OtpController).to(OtpController);
container.bind<TokenController>(TYPES.TokenController).to(TokenController);
container.bind<PasswordController>(TYPES.PasswordController).to(PasswordController);
container.bind<ChatController>(TYPES.ChatController).to(ChatController);
// Admin Controllers
container.bind<AdminUserController>(TYPES.AdminUserController).to(AdminUserController);
container.bind<AdminCompanyController>(TYPES.AdminCompanyController).to(AdminCompanyController);
container.bind<AdminJobController>(TYPES.AdminJobController).to(AdminJobController);
container.bind<AdminJobCategoryController>(TYPES.AdminJobCategoryController).to(AdminJobCategoryController);
container.bind<AdminSkillController>(TYPES.AdminSkillController).to(AdminSkillController);
container.bind<AdminJobRoleController>(TYPES.AdminJobRoleController).to(AdminJobRoleController);
container.bind<AdminSubscriptionPlanController>(TYPES.AdminSubscriptionPlanController).to(AdminSubscriptionPlanController);
container.bind<AdminPaymentOrderController>(TYPES.AdminPaymentOrderController).to(AdminPaymentOrderController);
container.bind<AdminDashboardController>(TYPES.AdminDashboardController).to(AdminDashboardController);

export { container };

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

const container = new Container();

// Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IConversationRepository>(TYPES.ConversationRepository).to(ConversationRepository);
container.bind<IMessageRepository>(TYPES.ChatMessageRepository).to(ChatMessageRepository);

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


// Controllers
container.bind<LoginController>(TYPES.LoginController).to(LoginController);
container.bind<RegistrationController>(TYPES.RegistrationController).to(RegistrationController);
container.bind<OtpController>(TYPES.OtpController).to(OtpController);
container.bind<TokenController>(TYPES.TokenController).to(TokenController);
container.bind<PasswordController>(TYPES.PasswordController).to(PasswordController);
container.bind<ChatController>(TYPES.ChatController).to(ChatController);

export { container };

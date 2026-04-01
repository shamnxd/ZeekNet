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
} as const;






import { Router } from 'express';
import { APP_ROUTES } from 'src/shared/constants/routes';
import { container } from 'src/infrastructure/di/container';
import { TYPES } from 'src/shared/constants/types';
import { RegistrationController } from 'src/presentation/controllers/auth/registration.controller';
import { LoginController } from 'src/presentation/controllers/auth/login.controller';
import { TokenController } from 'src/presentation/controllers/auth/token.controller';
import { PasswordController } from 'src/presentation/controllers/auth/password.controller';
import { OtpController } from 'src/presentation/controllers/auth/otp.controller';
import { authenticateToken } from 'src/presentation/middleware/auth.middleware';

const registrationController = container.get<RegistrationController>(TYPES.RegistrationController);
const loginController = container.get<LoginController>(TYPES.LoginController);
const tokenController = container.get<TokenController>(TYPES.TokenController);
const passwordController = container.get<PasswordController>(TYPES.PasswordController);
const otpController = container.get<OtpController>(TYPES.OtpController);

export class AuthRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.post(APP_ROUTES.AUTH.REGISTER, registrationController.register);
    this.router.post(APP_ROUTES.AUTH.LOGIN, loginController.login);
    this.router.post(APP_ROUTES.AUTH.ADMIN_LOGIN, loginController.adminLogin);
    this.router.post(APP_ROUTES.AUTH.GOOGLE_LOGIN, loginController.googleLogin);
    this.router.post(APP_ROUTES.AUTH.REFRESH, tokenController.refresh);
    this.router.get(APP_ROUTES.AUTH.CHECK_AUTH, authenticateToken, tokenController.checkAuth);
    this.router.post(APP_ROUTES.AUTH.FORGOT_PASSWORD, passwordController.forgotPassword);
    this.router.post(APP_ROUTES.AUTH.RESET_PASSWORD, passwordController.resetPassword);
    this.router.post(APP_ROUTES.AUTH.CHANGE_PASSWORD, authenticateToken, passwordController.changePassword);
    this.router.post(APP_ROUTES.AUTH.LOGOUT, authenticateToken, passwordController.logout);
    this.router.post(APP_ROUTES.AUTH.OTP_REQUEST, otpController.request);
    this.router.post(APP_ROUTES.AUTH.OTP_VERIFY, otpController.verify);
  }
}
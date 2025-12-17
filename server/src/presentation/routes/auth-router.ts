import { Router } from 'express';
import { registrationController, loginController, tokenController, passwordController, otpController } from '../../infrastructure/di/authDi';
import { AuthRoutes } from '../../domain/enums/routes.enum';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { RegisterDto } from '../../application/dto/auth/register.dto';
import { LoginDto } from '../../application/dto/auth/login.dto';

export class AuthRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.post(AuthRoutes.REGISTER, validateBody(RegisterDto), registrationController.register);

    this.router.post(AuthRoutes.LOGIN, loginController.login);

    this.router.post(AuthRoutes.ADMIN_LOGIN, loginController.adminLogin);

    this.router.post(AuthRoutes.GOOGLE_LOGIN, loginController.googleLogin);

    this.router.post(AuthRoutes.REFRESH, tokenController.refresh);

    this.router.get(AuthRoutes.CHECK_AUTH, authenticateToken, tokenController.checkAuth);

    this.router.post(AuthRoutes.FORGOT_PASSWORD, passwordController.forgotPassword);

    this.router.post(AuthRoutes.RESET_PASSWORD, passwordController.resetPassword);

    this.router.post(AuthRoutes.LOGOUT, passwordController.logout);

    this.router.post(AuthRoutes.OTP_REQUEST, otpController.request);

    this.router.post(AuthRoutes.OTP_VERIFY, otpController.verify);
  }
}
import { Router } from 'express';
import { registrationController, loginController, tokenController, passwordController, otpController } from 'src/infrastructure/di/authDi';

import { authenticateToken } from 'src/presentation/middleware/auth.middleware';

export class AuthRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.post('/register', registrationController.register);
    this.router.post('/login', loginController.login);
    this.router.post('/admin-login', loginController.adminLogin);
    this.router.post('/login/google', loginController.googleLogin);
    this.router.post('/refresh', tokenController.refresh);
    this.router.get('/check-auth', authenticateToken, tokenController.checkAuth);
    this.router.post('/forgot-password', passwordController.forgotPassword);
    this.router.post('/reset-password', passwordController.resetPassword);
    this.router.post('/change-password', authenticateToken, passwordController.changePassword);
    this.router.post('/logout', authenticateToken, passwordController.logout);
    this.router.post('/otp-request', otpController.request);
    this.router.post('/otp-verify', otpController.verify);
  }
}

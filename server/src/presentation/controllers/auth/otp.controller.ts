import { Request, Response, NextFunction } from 'express';
import { IMailerService } from '../../../domain/interfaces/services/IMailerService';
import { IOtpService } from '../../../domain/interfaces/services/IOtpService';
import { IPasswordHasher } from '../../../domain/interfaces/services/IPasswordHasher';
import { ITokenService } from '../../../domain/interfaces/services/ITokenService';
import { ICookieService } from '../../../domain/interfaces/services/ICookieService';
import { IUpdateUserRefreshTokenUseCase } from 'src/domain/interfaces/use-cases/auth/IUpdateUserRefreshTokenUseCase';
import { IUpdateUserVerificationStatusUseCase } from 'src/domain/interfaces/use-cases/auth/IUpdateUserVerificationStatusUseCase';
import { IGetUserByEmailUseCase } from 'src/domain/interfaces/use-cases/auth/IGetUserByEmailUseCase';
import { z } from 'zod';
import { handleValidationError, handleAsyncError, sendSuccessResponse, sendErrorResponse } from '../../../shared/utils/controller.utils';
import { welcomeTemplate } from '../../../infrastructure/messaging/templates/welcome.template';
import { getDashboardLink } from '../../../shared/utils/dashboard.utils';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { otpVerificationTemplate } from '../../../infrastructure/messaging/templates/otp-verification.template';

const RequestOtpDto = z.object({ email: z.string().email() });

export class OtpController {
  constructor(
    private readonly _otpService: IOtpService,
    private readonly _mailer: IMailerService,
    private readonly _getUserByEmailUseCase: IGetUserByEmailUseCase,
    private readonly _updateUserVerificationStatusUseCase: IUpdateUserVerificationStatusUseCase,
    private readonly _updateUserRefreshTokenUseCase: IUpdateUserRefreshTokenUseCase,
    private readonly _tokenService: ITokenService,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _cookieService: ICookieService,
  ) {}

  request = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = RequestOtpDto.safeParse(req.body);
    if (!parsed.success) return handleValidationError('Invalid email', next);

    try {
      const user = await this._getUserByEmailUseCase.execute(parsed.data.email);
      if (!user) {
        return handleValidationError('User not found', next);
      }
      if (user.isVerified) {
        sendSuccessResponse(res, 'User already verified', null);
        return;
      }

      let code: string;
      try {
        code = await this._otpService.generateAndStoreOtp(parsed.data.email);
      } catch (error: unknown) {
        if (error instanceof Error && error.message.includes('Please wait before requesting another OTP')) {
          sendErrorResponse(res, 'Please wait 30 seconds before requesting another OTP', null, 429);
          return;
        }
        throw error;
      }


      await this._mailer.sendMail(parsed.data.email, otpVerificationTemplate.subject, otpVerificationTemplate.html(code));
      sendSuccessResponse(res, 'OTP sent successfully', null);
    } catch (err) {
      handleAsyncError(err, next);
    }
  };

  verify = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, code } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return handleValidationError('Invalid email address', next);
    }
    if (!code || typeof code !== 'string' || code.length !== 6) {
      return handleValidationError('OTP code must be 6 characters', next);
    }

    try {
      const ok = await this._otpService.verifyOtp(email, code);
      if (!ok) return handleValidationError('Invalid or expired OTP', next);

      await this._updateUserVerificationStatusUseCase.execute(email, true);

      const user = await this._getUserByEmailUseCase.execute(email);
      if (!user) {
        return handleValidationError('User not found', next);
      }

      const accessToken = this._tokenService.signAccess({ sub: user.id, role: user.role as UserRole });
      const refreshToken = this._tokenService.signRefresh({ sub: user.id });
      const hashedRefresh = await this._passwordHasher.hash(refreshToken);

      await this._updateUserRefreshTokenUseCase.execute(user.id, hashedRefresh);

      this._cookieService.setRefreshToken(res, refreshToken);

      const dashboardLink = getDashboardLink(user.role);
      await this._mailer.sendMail(user.email, welcomeTemplate.subject, welcomeTemplate.html(user.name || 'User', dashboardLink));

      sendSuccessResponse(res, 'OTP verified and user verified', user, accessToken);
    } catch (err) {
      handleAsyncError(err, next);
    }
  };
}
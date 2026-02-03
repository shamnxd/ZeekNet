import { Request, Response, NextFunction } from 'express';
import { RequestOtpDto } from 'src/application/dtos/auth/verification/request-otp.use-case';
import { VerifyOtpDto } from 'src/application/dtos/auth/verification/verify-otp.dto';
import { IRequestOtpUseCase } from 'src/domain/interfaces/use-cases/auth/verification/IRequestOtpUseCase';
import { IVerifyOtpUseCase } from 'src/domain/interfaces/use-cases/auth/verification/IVerifyOtpUseCase';
import { ICookieService } from 'src/presentation/services/ICookieService';
import { handleValidationError, handleAsyncError, sendSuccessResponse, sendErrorResponse } from 'src/shared/utils/presentation/controller.utils';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';

export class OtpController {
  constructor(
    private readonly _requestOtpUseCase: IRequestOtpUseCase,
    private readonly _verifyOtpUseCase: IVerifyOtpUseCase,
    private readonly _cookieService: ICookieService,
  ) { }

  request = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = RequestOtpDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      await this._requestOtpUseCase.execute(parsed.data);
      sendSuccessResponse(res, 'OTP sent successfully', null);
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('Please wait before requesting another OTP')) {
        sendErrorResponse(res, 'Please wait 30 seconds before requesting another OTP', null, 429);
        return;
      }
      if (error instanceof Error && error.message === 'User already verified') {
        sendSuccessResponse(res, 'User already verified', null);
        return;
      }
      handleAsyncError(error, next);
    }
  };

  verify = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = VerifyOtpDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._verifyOtpUseCase.execute(parsed.data);

      if (result.tokens) {
        this._cookieService.setRefreshToken(res, result.tokens.refreshToken);
        sendSuccessResponse(res, 'OTP verified successfully', result.user, result.tokens.accessToken);
      }
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
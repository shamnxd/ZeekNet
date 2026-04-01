import { Request, Response, NextFunction } from 'express';
import { RegisterDto } from 'src/application/dtos/auth/registration/register.dto';
import { IRegisterUserUseCase } from 'src/domain/interfaces/use-cases/auth/registration/IRegisterUserUseCase';
import { formatZodErrors, handleAsyncError, handleValidationError, sendCreatedResponse } from 'src/shared/utils';
import { AUTH } from 'src/shared/constants/messages';

export class RegistrationController {
  constructor(private readonly _registerUserUseCase: IRegisterUserUseCase) { }
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = RegisterDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }
    try {
      const { user } = await this._registerUserUseCase.execute(parsed.data);
      sendCreatedResponse(res, AUTH.REGISTRATION_SUCCESS('User'), user);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}



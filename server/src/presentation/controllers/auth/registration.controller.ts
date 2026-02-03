import { Request, Response, NextFunction } from 'express';
import { RegisterDto } from 'src/application/dtos/auth/registration/register.dto';
import { IRegisterUserUseCase } from 'src/domain/interfaces/use-cases/auth/registration/IRegisterUserUseCase';
import { handleAsyncError, handleValidationError, sendCreatedResponse } from 'src/shared/utils/presentation/controller.utils';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';

export class RegistrationController {
  constructor(private readonly _registerUserUseCase: IRegisterUserUseCase) { }
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = RegisterDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }
    try {
      const { user } = await this._registerUserUseCase.execute(parsed.data);
      sendCreatedResponse(res, 'User registered successfully. Please verify your email.', user);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}

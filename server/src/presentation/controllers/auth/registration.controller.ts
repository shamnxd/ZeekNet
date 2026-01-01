import { Request, Response, NextFunction } from 'express';
import { RegisterDto } from 'src/application/dtos/auth/registration/requests/register.dto';
import { IRegisterUserUseCase } from 'src/domain/interfaces/use-cases/auth/registration/IRegisterUserUseCase';
import { validateBody } from 'src/presentation/middleware/validation.middleware';
import { handleAsyncError } from 'src/shared/utils/presentation/controller.utils';
import { sendSuccessResponse } from 'src/shared/utils/presentation/controller.utils';

export class RegistrationController {
  constructor(private readonly _registerUserUseCase: IRegisterUserUseCase) {}

  register = [
    validateBody(RegisterDto),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const { user } = await this._registerUserUseCase.execute(
          req.body.email,
          req.body.password,
          req.body.role,
          req.body.name,
        );

        sendSuccessResponse(res, 'User registered successfully. Please verify your email.', user, undefined, 201);
      } catch (error) {
        handleAsyncError(error, next);
      }
    },
  ];
}


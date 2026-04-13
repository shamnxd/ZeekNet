import { IOtpService } from 'src/domain/interfaces/services/IOtpService';
import { IMailerService } from 'src/domain/interfaces/services/IMailerService';
import { IRequestOtpUseCase } from 'src/domain/interfaces/use-cases/auth/verification/IRequestOtpUseCase';
import { ValidationError } from 'src/domain/errors/errors';
import { otpVerificationTemplate } from 'src/infrastructure/messaging/templates/otp-verification.template';
import { RequestOtpRequestDto } from 'src/application/dtos/auth/verification/request-otp.use-case';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';

import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR } from 'src/shared/constants/messages';


@injectable()
export class RequestOtpUseCase implements IRequestOtpUseCase {
  constructor(
    @inject(TYPES.OtpService) private readonly _otpService: IOtpService,
    @inject(TYPES.MailerService) private readonly _mailerService: IMailerService,
    @inject(TYPES.UserRepository) private readonly _userRepository: IUserRepository,
  ) { }


  async execute(params: RequestOtpRequestDto): Promise<void> {
    const { email } = params;

    const user = await this._userRepository.findOne({ email });
    if (!user) {
      throw new ValidationError(ERROR.NOT_FOUND('User'));
    }

    if (user.isVerified) {
      throw new ValidationError('User already verified');
    }

    const code = await this._otpService.generateAndStoreOtp(email);
    await this._mailerService.sendMail(
      email,
      otpVerificationTemplate.subject,
      otpVerificationTemplate.html(code),
    );
  }
}
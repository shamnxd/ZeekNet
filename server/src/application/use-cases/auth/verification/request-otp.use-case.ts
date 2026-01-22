import { IOtpService } from 'src/domain/interfaces/services/IOtpService';
import { IMailerService } from 'src/domain/interfaces/services/IMailerService';
import { IRequestOtpUseCase } from 'src/domain/interfaces/use-cases/auth/verification/IRequestOtpUseCase';
import { ValidationError } from 'src/domain/errors/errors';
import { otpVerificationTemplate } from 'src/infrastructure/messaging/templates/otp-verification.template';
import { RequestOtpRequestDto } from 'src/application/dtos/auth/verification/request-otp.use-case';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';

export class RequestOtpUseCase implements IRequestOtpUseCase {
    constructor(
        private readonly _otpService: IOtpService,
        private readonly _mailerService: IMailerService,
        private readonly _userRepository: IUserRepository,
    ) { }

    async execute(params: RequestOtpRequestDto): Promise<void> {
        const { email } = params;

        const user = await this._userRepository.findOne({ email });
        if (!user) {
            throw new ValidationError('User not found');
        }

        if (user.isVerified) {
            throw new ValidationError('User already verified');
        }

        const code = await this._otpService.generateAndStoreOtp(email);
        await this._mailerService.sendMail(
            email,
            otpVerificationTemplate.subject,
            otpVerificationTemplate.html(code)
        );
    }
}
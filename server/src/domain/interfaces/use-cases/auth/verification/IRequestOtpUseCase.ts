import { RequestOtpRequestDto } from 'src/application/dtos/auth/verification/request-otp.use-case';

export interface IRequestOtpUseCase {
    execute(params: RequestOtpRequestDto): Promise<void>;
}
import { LoginResponseDto } from "src/application/dtos/auth/session/login-response.dto";
import { VerifyOtpRequestDto } from "src/application/dtos/auth/verification/verify-otp.dto";

export interface IVerifyOtpUseCase {
  execute(params: VerifyOtpRequestDto): Promise<LoginResponseDto>;
}

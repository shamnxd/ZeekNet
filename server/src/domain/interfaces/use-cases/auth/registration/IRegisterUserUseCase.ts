import { RegisterRequestDto } from 'src/application/dtos/auth/registration/register.dto';
import { RegisterResponseDto } from 'src/application/dtos/auth/registration/register-response.dto';

export interface IRegisterUserUseCase {
  execute(params: RegisterRequestDto): Promise<RegisterResponseDto>;
}


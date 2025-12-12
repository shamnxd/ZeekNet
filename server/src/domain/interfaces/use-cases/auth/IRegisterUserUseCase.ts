import { RegisterResponseDto } from 'src/application/dto/auth/register-response.dto';
import { UserRole } from 'src/domain/enums/user-role.enum';


export interface IRegisterUserUseCase {
  execute(email: string, password: string, role?: UserRole, name?: string): Promise<RegisterResponseDto>;
}

import { InitiateCompensationRequestDto } from 'src/application/dtos/application/compensation/requests/initiate-compensation.dto';
import { ATSCompensationResponseDto } from 'src/application/dtos/application/compensation/responses/ats-compensation.response.dto';

export interface IInitiateCompensationUseCase {
  execute(dto: InitiateCompensationRequestDto): Promise<ATSCompensationResponseDto>;
}


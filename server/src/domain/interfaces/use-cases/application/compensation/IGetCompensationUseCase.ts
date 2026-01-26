import { ATSCompensationResponseDto } from 'src/application/dtos/application/compensation/responses/ats-compensation.response.dto';

export interface IGetCompensationUseCase {
  execute(applicationId: string): Promise<ATSCompensationResponseDto | null>;
}


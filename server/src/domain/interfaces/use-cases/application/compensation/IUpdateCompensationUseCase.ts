import { UpdateCompensationRequestDto } from 'src/application/dtos/application/compensation/requests/update-compensation.dto';
import { ATSCompensationResponseDto } from 'src/application/dtos/application/compensation/responses/ats-compensation.response.dto';

export interface IUpdateCompensationUseCase {
  execute(dto: UpdateCompensationRequestDto): Promise<ATSCompensationResponseDto>;
}

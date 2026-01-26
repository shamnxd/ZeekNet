import { ATSCompensation } from 'src/domain/entities/ats-compensation.entity';
import { ATSCompensationResponseDto } from 'src/application/dtos/application/compensation/responses/ats-compensation.response.dto';

export class ATSCompensationMapper {
  static toResponse(entity: ATSCompensation | null): ATSCompensationResponseDto | null {
    if (!entity) return null;
    return new ATSCompensationResponseDto(
      entity.id,
      entity.applicationId,
      entity.candidateExpected,
      entity.benefits,
      entity.createdAt,
      entity.updatedAt,
      entity.companyProposed,
      entity.finalAgreed,
      entity.expectedJoining,
      entity.approvedAt,
      entity.approvedBy,
      entity.approvedByName,
    );
  }
}

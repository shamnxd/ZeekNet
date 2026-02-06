
import { IUpdateCompensationUseCase } from 'src/domain/interfaces/use-cases/application/compensation/IUpdateCompensationUseCase';
import { IATSCompensationRepository } from 'src/domain/interfaces/repositories/ats/IATSCompensationRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IAddCommentUseCase } from 'src/domain/interfaces/use-cases/application/comments/IAddCommentUseCase';

import { ATSCompensation } from 'src/domain/entities/ats-compensation.entity';
import { ATSStage } from 'src/domain/enums/ats-stage.enum';
import { NotFoundError } from 'src/domain/errors/errors';
import { UpdateCompensationRequestDto } from 'src/application/dtos/application/compensation/requests/update-compensation.dto';
import { ATSCompensationResponseDto } from 'src/application/dtos/application/compensation/responses/ats-compensation.response.dto';
import { ATSCompensationMapper } from 'src/application/mappers/ats/ats-compensation.mapper';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';

export class UpdateCompensationUseCase implements IUpdateCompensationUseCase {
  constructor(
    private readonly _compensationRepository: IATSCompensationRepository,
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _addCommentUseCase: IAddCommentUseCase,

    private readonly _userRepository: IUserRepository,
  ) { }

  async execute(dto: UpdateCompensationRequestDto): Promise<ATSCompensationResponseDto> {
    const existing = await this._compensationRepository.findByApplicationId(dto.applicationId);
    if (!existing) {
      throw new NotFoundError('Compensation record not found. Please initiate compensation first.');
    }


    const application = await this._jobApplicationRepository.findById(dto.applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    const currentUser = await this._userRepository.findById(dto.performedBy);
    const performedByName = currentUser ? currentUser.name : 'Unknown';

    const updateData: {
      candidateExpected?: string;
      companyProposed?: string;
      expectedJoining?: Date;
      benefits?: string[];
      finalAgreed?: string;
      approvedAt?: Date;
      approvedBy?: string;
      approvedByName?: string;
    } = {};

    if (dto.candidateExpected !== undefined) {
      updateData.candidateExpected = dto.candidateExpected;
    }
    if (dto.companyProposed !== undefined) {
      updateData.companyProposed = dto.companyProposed;
    }
    if (dto.expectedJoining !== undefined) {
      updateData.expectedJoining = dto.expectedJoining;
    }
    if (dto.benefits !== undefined) {
      updateData.benefits = dto.benefits;
    }
    if (dto.finalAgreed !== undefined) {
      updateData.finalAgreed = dto.finalAgreed;
    }


    if (dto.approvedAt || dto.finalAgreed) {
      updateData.approvedAt = dto.approvedAt || new Date();
      updateData.approvedBy = dto.approvedBy || dto.performedBy;
      updateData.approvedByName = dto.approvedByName || performedByName;
      if (dto.finalAgreed && !updateData.finalAgreed) {
        updateData.finalAgreed = dto.finalAgreed;
      }
    }

    const updated = await this._compensationRepository.update(dto.applicationId, updateData);

    if (!updated) {
      throw new NotFoundError('Failed to update compensation');
    }


    const activityType = dto.approvedAt || dto.finalAgreed ? 'approved' : 'updated';




    if (dto.notes) {
      await this._addCommentUseCase.execute({
        applicationId: dto.applicationId,
        comment: dto.notes,
        stage: ATSStage.COMPENSATION,
        userId: dto.performedBy,
      });
    }

    return ATSCompensationMapper.toResponse(updated) as ATSCompensationResponseDto;
  }
}


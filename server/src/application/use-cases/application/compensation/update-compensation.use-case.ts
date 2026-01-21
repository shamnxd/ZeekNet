import { IUpdateCompensationUseCase } from 'src/domain/interfaces/use-cases/application/compensation/IUpdateCompensationUseCase';
import { IATSCompensationRepository } from 'src/domain/interfaces/repositories/ats/IATSCompensationRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IAddCommentUseCase } from 'src/domain/interfaces/use-cases/application/comments/IAddCommentUseCase';
import { IActivityLoggerService } from 'src/domain/interfaces/services/IActivityLoggerService';
import { ATSCompensation } from 'src/domain/entities/ats-compensation.entity';
import { ATSStage } from 'src/domain/enums/ats-stage.enum';
import { NotFoundError } from 'src/domain/errors/errors';

export class UpdateCompensationUseCase implements IUpdateCompensationUseCase {
  constructor(
    private compensationRepository: IATSCompensationRepository,
    private jobApplicationRepository: IJobApplicationRepository,
    private addCommentUseCase: IAddCommentUseCase,
    private activityLoggerService: IActivityLoggerService,
  ) { }

  async execute(data: {
    applicationId: string;
    candidateExpected?: string;
    companyProposed?: string;
    expectedJoining?: Date;
    benefits?: string[];
    finalAgreed?: string;
    approvedAt?: Date;
    approvedBy?: string;
    approvedByName?: string;
    notes?: string;
    performedBy: string;
    performedByName: string;
  }): Promise<ATSCompensation> {
    const existing = await this.compensationRepository.findByApplicationId(data.applicationId);
    if (!existing) {
      throw new NotFoundError('Compensation record not found. Please initiate compensation first.');
    }


    const application = await this.jobApplicationRepository.findById(data.applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

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

    if (data.candidateExpected !== undefined) {
      updateData.candidateExpected = data.candidateExpected;
    }
    if (data.companyProposed !== undefined) {
      updateData.companyProposed = data.companyProposed;
    }
    if (data.expectedJoining !== undefined) {
      updateData.expectedJoining = data.expectedJoining;
    }
    if (data.benefits !== undefined) {
      updateData.benefits = data.benefits;
    }
    if (data.finalAgreed !== undefined) {
      updateData.finalAgreed = data.finalAgreed;
    }


    if (data.approvedAt || data.finalAgreed) {
      updateData.approvedAt = data.approvedAt || new Date();
      updateData.approvedBy = data.approvedBy || data.performedBy;
      updateData.approvedByName = data.approvedByName || data.performedByName;
      if (data.finalAgreed && !updateData.finalAgreed) {
        updateData.finalAgreed = data.finalAgreed;
      }
    }

    const updated = await this.compensationRepository.update(data.applicationId, updateData);

    if (!updated) {
      throw new NotFoundError('Failed to update compensation');
    }


    const activityType = data.approvedAt || data.finalAgreed ? 'approved' : 'updated';


    await this.activityLoggerService.logCompensationActivity({
      applicationId: data.applicationId,
      type: activityType,
      candidateExpected: data.candidateExpected,
      companyProposed: data.companyProposed,
      finalAgreed: data.finalAgreed,
      expectedJoining: data.expectedJoining ? data.expectedJoining.toISOString() : undefined,
      benefits: data.benefits,
      approvedAt: updateData.approvedAt,
      stage: ATSStage.COMPENSATION,
      subStage: application.subStage,
      performedBy: data.performedBy,
      performedByName: data.performedByName,
    });

    if (data.notes) {
      await this.addCommentUseCase.execute({
        applicationId: data.applicationId,
        comment: data.notes,
        stage: ATSStage.COMPENSATION,
        addedBy: data.performedBy,
        addedByName: data.performedByName,
      });
    }

    return updated;
  }
}


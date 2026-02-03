import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { BulkUpdateApplicationsRequestDto } from 'src/application/dtos/company/hiring/requests/bulk-update-applications.dto';
import { BulkUpdateApplicationsResponseDto } from 'src/application/dtos/company/hiring/responses/bulk-update-applications-response.dto';
import { BulkUpdateApplicationsMapper } from 'src/application/mappers/company/hiring/bulk-update-applications.mapper';
import { NotFoundError } from 'src/domain/errors/errors';
import { ATSStage } from 'src/domain/enums/ats-stage.enum';
import { IBulkUpdateApplicationsUseCase } from 'src/domain/interfaces/use-cases/company/hiring/IBulkUpdateApplicationsUseCase';

export class BulkUpdateApplicationsUseCase implements IBulkUpdateApplicationsUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
  ) { }

  async execute(dto: BulkUpdateApplicationsRequestDto): Promise<BulkUpdateApplicationsResponseDto> {
    const { application_ids, stage, companyId: userId } = dto;

    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    if (!companyProfile) {
      throw new NotFoundError('Company profile not found');
    }
    const companyId = companyProfile.id;

    let updated = 0;
    let failed = 0;
    const errors: Array<{ application_id: string; error: string }> = [];

    for (const applicationId of application_ids) {
      try {
        const application = await this._jobApplicationRepository.findById(applicationId);

        if (!application) {
          failed++;
          errors.push({
            application_id: applicationId,
            error: 'Application not found',
          });
          continue;
        }

        if (application.companyId !== companyId) {
          failed++;
          errors.push({
            application_id: applicationId,
            error: 'Application does not belong to this company',
          });
          continue;
        }

        const validationError = this.validateStageTransition(application.stage, stage);
        if (validationError) {
          failed++;
          errors.push({
            application_id: applicationId,
            error: validationError,
          });
          continue;
        }

        await this._jobApplicationRepository.update(applicationId, { stage });
        updated++;
      } catch (error) {
        failed++;
        errors.push({
          application_id: applicationId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const success = !(updated === 0 && failed > 0);

    return BulkUpdateApplicationsMapper.toResponse(success, updated, failed, errors);
  }

  private validateStageTransition(currentStage: string, newStage: string): string | null {
    const validStages = Object.values(ATSStage);

    if (!validStages.includes(newStage as ATSStage)) {
      return `Invalid stage: '${newStage}'`;
    }

    return null;
  }
}

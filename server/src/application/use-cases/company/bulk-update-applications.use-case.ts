import { z } from 'zod';
import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { BulkUpdateApplicationsDto } from '../../dto/application/bulk-update-applications.dto';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { ATSStage } from '../../../domain/enums/ats-stage.enum';
import { IBulkUpdateApplicationsUseCase } from '../../../domain/interfaces/use-cases/company/IBulkUpdateApplicationsUseCase';

export class BulkUpdateApplicationsUseCase implements IBulkUpdateApplicationsUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
  ) {}

  async execute(
    data: z.infer<typeof BulkUpdateApplicationsDto> & { companyId: string },
  ): Promise<{ success: boolean; updated: number; failed: number; errors: Array<{ application_id: string; error: string }> }> {
    const { application_ids, stage, companyId: userId } = data;

    
    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    if (!companyProfile) {
      throw new NotFoundError('Company profile not found');
    }
    const companyId = companyProfile.id;

    const results = {
      success: true,
      updated: 0,
      failed: 0,
      errors: [] as Array<{ application_id: string; error: string }>,
    };

    
    for (const applicationId of application_ids) {
      try {
        
        const application = await this._jobApplicationRepository.findById(applicationId);
        
        if (!application) {
          results.failed++;
          results.errors.push({
            application_id: applicationId,
            error: 'Application not found',
          });
          continue;
        }

        
        if (application.companyId !== companyId) {
          results.failed++;
          results.errors.push({
            application_id: applicationId,
            error: 'Application does not belong to this company',
          });
          continue;
        }

        
        const validationError = this.validateStageTransition(application.stage, stage);
        if (validationError) {
          results.failed++;
          results.errors.push({
            application_id: applicationId,
            error: validationError,
          });
          continue;
        }

        
        await this._jobApplicationRepository.update(applicationId, { stage });
        results.updated++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          application_id: applicationId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    
    if (results.updated === 0 && results.failed > 0) {
      results.success = false;
    }

    return results;
  }

  private validateStageTransition(currentStage: string, newStage: string): string | null {
    // Basic validation - proper validation should be done by move-stage use case
    // which checks against job pipeline config
    const validStages = Object.values(ATSStage);
    
    if (!validStages.includes(newStage as ATSStage)) {
      return `Invalid stage: '${newStage}'`;
    }
    
    // Allow any valid stage transition - detailed validation in move-stage use case
    return null;
  }
}

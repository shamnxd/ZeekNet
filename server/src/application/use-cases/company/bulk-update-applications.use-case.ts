import { z } from 'zod';
import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { BulkUpdateApplicationsDto } from '../../dto/application/bulk-update-applications.dto';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';

export interface IBulkUpdateApplicationsUseCase {
  execute(
    data: z.infer<typeof BulkUpdateApplicationsDto> & { companyId: string }
  ): Promise<{ success: boolean; updated: number; failed: number; errors: Array<{ application_id: string; error: string }> }>;
}

export class BulkUpdateApplicationsUseCase implements IBulkUpdateApplicationsUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
  ) {}

  async execute(
    data: z.infer<typeof BulkUpdateApplicationsDto> & { companyId: string },
  ): Promise<{ success: boolean; updated: number; failed: number; errors: Array<{ application_id: string; error: string }> }> {
    const { application_ids, stage, companyId } = data;

    // Verify company exists
    const company = await this._companyProfileRepository.findById(companyId);
    if (!company) {
      throw new NotFoundError('Company not found');
    }

    const results = {
      success: true,
      updated: 0,
      failed: 0,
      errors: [] as Array<{ application_id: string; error: string }>,
    };

    // Process each application
    for (const applicationId of application_ids) {
      try {
        // Find the application
        const application = await this._jobApplicationRepository.findById(applicationId);
        
        if (!application) {
          results.failed++;
          results.errors.push({
            application_id: applicationId,
            error: 'Application not found',
          });
          continue;
        }

        // Verify application belongs to this company
        if (application.companyId !== companyId) {
          results.failed++;
          results.errors.push({
            application_id: applicationId,
            error: 'Application does not belong to this company',
          });
          continue;
        }

        // Validate stage transition
        const validationError = this.validateStageTransition(application.stage, stage);
        if (validationError) {
          results.failed++;
          results.errors.push({
            application_id: applicationId,
            error: validationError,
          });
          continue;
        }

        // Update the application
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

    // If all failed, mark as not successful
    if (results.updated === 0 && results.failed > 0) {
      results.success = false;
    }

    return results;
  }

  private validateStageTransition(currentStage: string, newStage: string): string | null {
    // Cannot change hired or rejected applications
    if (currentStage === 'hired' || currentStage === 'rejected') {
      return `Cannot change application in '${currentStage}' stage`;
    }

    // Validate shortlist transition
    if (newStage === 'shortlisted') {
      if (currentStage !== 'applied') {
        return `Cannot shortlist application in '${currentStage}' stage. Only 'applied' applications can be shortlisted.`;
      }
    }

    // Validate reject transition
    if (newStage === 'rejected') {
      if (currentStage !== 'applied' && currentStage !== 'shortlisted' && currentStage !== 'interview') {
        return `Cannot reject application in '${currentStage}' stage`;
      }
    }

    return null;
  }
}

import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR } from 'src/shared/constants/messages';
import { IGetJobATSPipelineUseCase } from 'src/domain/interfaces/use-cases/application/pipeline/IGetJobATSPipelineUseCase';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { NotFoundError, ValidationError } from 'src/domain/errors/errors';
import { GetJobPipelineDto } from 'src/application/dtos/application/requests/get-job-pipeline.dto';
import { IGetCompanyIdByUserIdUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyIdByUserIdUseCase';
import { JobATSPipelineResponseDto } from 'src/application/dtos/application/pipeline/responses/job-ats-pipeline-response.dto';
import { STAGE_TO_SUB_STAGES } from 'src/domain/utils/ats-pipeline.util';
import { ATSPipelineConfig } from 'src/domain/interfaces/ats-pipeline-config.interface';
import { ATSSubStage } from 'src/domain/enums/ats-stage.enum';

@injectable()
export class GetJobATSPipelineUseCase implements IGetJobATSPipelineUseCase {
  constructor(
    @inject(TYPES.JobPostingRepository) private jobPostingRepository: IJobPostingRepository,
    @inject(TYPES.GetCompanyIdByUserIdUseCase) private getCompanyIdByUserIdUseCase: IGetCompanyIdByUserIdUseCase,
  ) { }

  async execute(dto: GetJobPipelineDto): Promise<JobATSPipelineResponseDto> {
    const companyId = await this.getCompanyIdByUserIdUseCase.execute(dto.userId);
    const job = await this.jobPostingRepository.findById(dto.jobId);

    if (!job) {
      throw new NotFoundError(ERROR.NOT_FOUND('Job'));
    }

    if (job.companyId !== companyId) {
      throw new ValidationError('Job does not belong to this company');
    }

    const pipelineConfig: ATSPipelineConfig = {};
    if (job.enabledStages) {
      job.enabledStages.forEach(stage => {
        if (STAGE_TO_SUB_STAGES[stage]) {
          pipelineConfig[stage] = [...STAGE_TO_SUB_STAGES[stage]] as ATSSubStage[];
        }
      });
    }

    return {
      jobId: job.id,
      enabledStages: job.enabledStages,
      pipelineConfig: pipelineConfig,
    };
  }
}

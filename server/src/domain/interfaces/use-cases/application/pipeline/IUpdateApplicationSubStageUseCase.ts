import { JobApplication } from 'src/domain/entities/job-application.entity';
import { ATSSubStage } from 'src/domain/enums/ats-stage.enum';

export interface IUpdateApplicationSubStageUseCase {
  execute(data: {
    applicationId: string;
    subStage: ATSSubStage;
    performedBy: string;
    performedByName: string;
  }): Promise<JobApplication>;
}


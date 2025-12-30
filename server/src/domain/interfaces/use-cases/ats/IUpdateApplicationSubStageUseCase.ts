import { JobApplication } from '../../../entities/job-application.entity';
import { ATSSubStage } from '../../../enums/ats-stage.enum';

export interface IUpdateApplicationSubStageUseCase {
  execute(data: {
    applicationId: string;
    subStage: ATSSubStage;
    performedBy: string;
    performedByName: string;
  }): Promise<JobApplication>;
}


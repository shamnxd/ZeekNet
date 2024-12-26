import { JobApplication } from '../../../entities/job-application.entity';
import { ATSStage, ATSSubStage } from '../../../enums/ats-stage.enum';

export interface IMoveApplicationStageUseCase {
  execute(data: {
    applicationId: string;
    nextStage: ATSStage;
    subStage?: ATSSubStage;
    performedBy: string;
    performedByName: string;
  }): Promise<JobApplication>;
}


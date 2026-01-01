import { JobApplication } from 'src/domain/entities/job-application.entity';
import { ATSStage, ATSSubStage } from 'src/domain/enums/ats-stage.enum';

export interface IMoveApplicationStageUseCase {
  execute(data: {
    applicationId: string;
    nextStage: ATSStage;
    subStage?: ATSSubStage;
    performedBy: string;
    performedByName: string;
  }): Promise<JobApplication>;
}


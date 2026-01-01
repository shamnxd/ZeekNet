import { ATSComment } from 'src/domain/entities/ats-comment.entity';
import { ATSStage, ATSSubStage } from 'src/domain/enums/ats-stage.enum';

export interface IAddCommentUseCase {
  execute(data: {
    applicationId: string;
    comment: string;
    stage: ATSStage;
    subStage?: ATSSubStage;
    addedBy: string;
    addedByName: string;
  }): Promise<ATSComment>;
}

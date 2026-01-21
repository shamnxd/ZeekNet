import { ATSStage, ATSSubStage } from 'src/domain/enums/ats-stage.enum';

export interface AddCommentParamsDto {
    applicationId: string;
    comment: string;
    stage: ATSStage;
    subStage?: ATSSubStage;
    addedBy: string;
    addedByName: string;
}


import { ATSSubStage } from 'src/domain/enums/ats-stage.enum';

export interface ATSPipelineConfig {
    [key: string]: ATSSubStage[];
}

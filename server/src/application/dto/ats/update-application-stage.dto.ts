import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ATSStage, ATSSubStage } from '../../../domain/enums/ats-stage.enum';

export class UpdateApplicationStageDto {
  @IsEnum(ATSStage)
  @IsNotEmpty()
    stage!: ATSStage;

  @IsNotEmpty()
    subStage!: ATSSubStage;

  @IsOptional()
    rejectionReason?: string;
}

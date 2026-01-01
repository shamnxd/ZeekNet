import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ATSStage, ATSSubStage } from 'src/domain/enums/ats-stage.enum';

export class AddCommentDto {
  @IsString()
  @IsNotEmpty()
    applicationId!: string;

  @IsString()
  @IsNotEmpty()
    comment!: string;

  @IsEnum(ATSStage)
    stage!: ATSStage;

  @IsString()
  @IsOptional()
    subStage?: ATSSubStage;
}


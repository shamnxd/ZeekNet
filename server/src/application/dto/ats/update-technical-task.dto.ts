import { IsString, IsOptional, IsEnum, IsNumber, Min, Max, IsDateString } from 'class-validator';

export class UpdateTechnicalTaskDto {
  @IsString()
  @IsOptional()
    title?: string;

  @IsString()
  @IsOptional()
    description?: string;

  @IsDateString()
  @IsOptional()
    deadline?: string;

  @IsString()
  @IsOptional()
    documentUrl?: string;

  @IsString()
  @IsOptional()
    documentFilename?: string;

  @IsString()
  @IsOptional()
    submissionUrl?: string;

  @IsString()
  @IsOptional()
    submissionFilename?: string;

  @IsEnum(['assigned', 'submitted', 'under_review', 'completed', 'cancelled'])
  @IsOptional()
    status?: 'assigned' | 'submitted' | 'under_review' | 'completed' | 'cancelled';

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
    rating?: number;

  @IsString()
  @IsOptional()
    feedback?: string;
}

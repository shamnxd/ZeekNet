import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class AssignTechnicalTaskDto {
  @IsString()
  @IsNotEmpty()
    applicationId!: string;

  @IsString()
  @IsNotEmpty()
    title!: string;

  @IsString()
  @IsNotEmpty()
    description!: string;

  @IsDateString()
  @IsNotEmpty()
    deadline!: string;

  @IsString()
  @IsOptional()
    documentUrl?: string;

  @IsString()
  @IsOptional()
    documentFilename?: string;
}

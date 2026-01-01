import { IsString, IsOptional, IsUrl } from 'class-validator';

export class SubmitTechnicalTaskDto {
  @IsString()
  @IsOptional()
    submissionUrl?: string;

  @IsString()
  @IsOptional()
    submissionFilename?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
    submissionLink?: string;

  @IsString()
  @IsOptional()
    submissionNote?: string;
}

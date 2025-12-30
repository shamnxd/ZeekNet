import { IsString, IsNotEmpty, IsDateString, IsNumber, IsEnum, IsArray, IsOptional, Min, Max } from 'class-validator';

export class ScheduleInterviewDto {
  @IsString()
  @IsNotEmpty()
    applicationId!: string;

  @IsString()
  @IsNotEmpty()
    title!: string;

  @IsDateString()
  @IsNotEmpty()
    scheduledDate!: string;

  @IsEnum(['online', 'offline'])
    type!: 'online' | 'offline';

  @IsString()
  @IsOptional()
    meetingLink?: string;

  @IsString()
  @IsOptional()
    location?: string;
}

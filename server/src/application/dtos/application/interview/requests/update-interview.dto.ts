import { IsString, IsOptional, IsEnum, IsNumber, Min, Max } from 'class-validator';

export class UpdateInterviewDto {
  @IsEnum(['scheduled', 'completed', 'cancelled'])
  @IsOptional()
    status?: 'scheduled' | 'completed' | 'cancelled';

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
    rating?: number;

  @IsString()
  @IsOptional()
    feedback?: string;
}

import { IsString, IsOptional } from 'class-validator';

export class InitiateCompensationDto {
  @IsString()
    candidateExpected: string;

  @IsString()
  @IsOptional()
    notes?: string;
}



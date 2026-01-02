import { IsString, IsOptional, IsArray, IsDateString } from 'class-validator';

export class UpdateCompensationDto {
  @IsString()
  @IsOptional()
    candidateExpected?: string;

  @IsString()
  @IsOptional()
    companyProposed?: string;

  @IsDateString()
  @IsOptional()
    expectedJoining?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
    benefits?: string[];

  @IsString()
  @IsOptional()
    finalAgreed?: string;

  @IsDateString()
  @IsOptional()
    approvedAt?: string;

  @IsString()
  @IsOptional()
    approvedBy?: string;

  @IsString()
  @IsOptional()
    approvedByName?: string;

  @IsString()
  @IsOptional()
    notes?: string;
}


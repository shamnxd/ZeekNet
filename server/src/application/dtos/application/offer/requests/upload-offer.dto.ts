import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UploadOfferDto {
  @IsString()
  @IsNotEmpty()
    applicationId!: string;

  @IsString()
  @IsOptional()
    offerAmount?: string;

  @IsString()
  @IsOptional()
    documentUrl?: string;

  @IsString()
  @IsOptional()
    documentFilename?: string;
}

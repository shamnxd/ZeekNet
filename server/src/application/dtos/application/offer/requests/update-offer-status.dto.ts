import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateOfferStatusDto {
  @IsEnum(['draft', 'sent', 'signed', 'declined'])
    status!: 'draft' | 'sent' | 'signed' | 'declined';
  
  @IsOptional()
  @IsString()
    withdrawalReason?: string;
}

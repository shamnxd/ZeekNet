import { IsString } from 'class-validator';

export class AddCompensationNoteDto {
  @IsString()
    note: string;
}



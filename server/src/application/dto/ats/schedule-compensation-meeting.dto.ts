import { IsString, IsEnum, IsDateString, IsOptional } from 'class-validator';

export class ScheduleCompensationMeetingDto {
  @IsEnum(['call', 'online', 'in-person'])
    type: 'call' | 'online' | 'in-person';

  @IsDateString()
    date: string;

  @IsString()
    time: string;

  @IsEnum(['in-app', 'external'])
  @IsOptional()
    videoType?: 'in-app' | 'external';

  @IsString()
  @IsOptional()
    webrtcRoomId?: string;

  @IsString()
  @IsOptional()
    location?: string;

  @IsString()
  @IsOptional()
    meetingLink?: string;

  @IsString()
  @IsOptional()
    notes?: string;
}



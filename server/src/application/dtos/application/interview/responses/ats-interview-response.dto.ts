export interface ATSInterviewResponseDto {
  id: string;
  applicationId: string;
  title: string;
  scheduledDate: Date;
  type: string;
  videoType?: string;
  webrtcRoomId?: string;
  meetingLink?: string;
  location?: string;
  status: string;
  rating?: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}


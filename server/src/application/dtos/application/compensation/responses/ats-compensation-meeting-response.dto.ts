export interface ATSCompensationMeetingResponseDto {
  id: string;
  applicationId: string;
  scheduledDate: Date;
  type: string;
  videoType?: string;
  webrtcRoomId?: string;
  meetingLink?: string;
  location?: string;
  status: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}


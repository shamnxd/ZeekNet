export interface InterviewForSeekerDto {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetInterviewsByApplicationUseCase {
  execute(userId: string, applicationId: string): Promise<InterviewForSeekerDto[]>;
}

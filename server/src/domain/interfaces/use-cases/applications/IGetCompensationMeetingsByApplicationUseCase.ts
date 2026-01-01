export interface CompensationMeetingForSeekerDto {
  id: string;
  applicationId: string;
  type: string;
  scheduledDate: Date;
  location?: string;
  meetingLink?: string;
  status: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetCompensationMeetingsByApplicationUseCase {
  execute(userId: string, applicationId: string): Promise<CompensationMeetingForSeekerDto[]>;
}

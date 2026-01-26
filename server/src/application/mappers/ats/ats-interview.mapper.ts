import { ATSInterview } from 'src/domain/entities/ats-interview.entity';
import { ATSInterviewResponseDto } from 'src/application/dtos/application/interview/responses/ats-interview-response.dto';

export class ATSInterviewMapper {
  static toResponse(interview: ATSInterview): ATSInterviewResponseDto {
    return {
      id: interview.id,
      applicationId: interview.applicationId,
      title: interview.title,
      scheduledDate: interview.scheduledDate,
      type: interview.type,
      videoType: interview.videoType,
      webrtcRoomId: interview.webrtcRoomId,
      meetingLink: interview.meetingLink,
      location: interview.location,
      status: interview.status,
      createdAt: interview.createdAt,
      updatedAt: interview.updatedAt,
    };
  }

  static toResponseList(interviews: ATSInterview[]): ATSInterviewResponseDto[] {
    return interviews.map((interview) => this.toResponse(interview));
  }
}


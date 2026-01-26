import { ATSCompensationMeeting } from 'src/domain/entities/ats-compensation-meeting.entity';
import { ATSCompensationMeetingResponseDto } from 'src/application/dtos/application/compensation/responses/ats-compensation-meeting-response.dto';

export class ATSCompensationMeetingMapper {
  static toResponse(meeting: ATSCompensationMeeting): ATSCompensationMeetingResponseDto {
    return {
      id: meeting.id,
      applicationId: meeting.applicationId,
      scheduledDate: meeting.scheduledDate,
      type: meeting.type,
      videoType: meeting.videoType,
      webrtcRoomId: meeting.webrtcRoomId,
      meetingLink: meeting.meetingLink,
      location: meeting.location,
      status: meeting.status,
      notes: meeting.notes,
      createdAt: meeting.createdAt,
      updatedAt: meeting.updatedAt,
    };
  }

  static toResponseList(meetings: ATSCompensationMeeting[]): ATSCompensationMeetingResponseDto[] {
    return meetings.map((meeting) => this.toResponse(meeting));
  }
}


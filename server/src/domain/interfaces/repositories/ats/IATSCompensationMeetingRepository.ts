import { ATSCompensationMeeting } from 'src/domain/entities/ats-compensation-meeting.entity';

export interface IATSCompensationMeetingRepository {
  create(meeting: ATSCompensationMeeting): Promise<ATSCompensationMeeting>;
  findById(id: string): Promise<ATSCompensationMeeting | null>;
  findByApplicationId(applicationId: string): Promise<ATSCompensationMeeting[]>;
  update(id: string, updateData: Partial<ATSCompensationMeeting>): Promise<ATSCompensationMeeting | null>;
  delete(id: string): Promise<boolean>;
}


export interface IATSCompensationMeetingRepository {
  create(meeting: ATSCompensationMeeting): Promise<ATSCompensationMeeting>;
  findById(id: string): Promise<ATSCompensationMeeting | null>;
  findByApplicationId(applicationId: string): Promise<ATSCompensationMeeting[]>;
  update(id: string, updateData: Partial<ATSCompensationMeeting>): Promise<ATSCompensationMeeting | null>;
  delete(id: string): Promise<boolean>;
}


export interface IATSCompensationMeetingRepository {
  create(meeting: ATSCompensationMeeting): Promise<ATSCompensationMeeting>;
  findById(id: string): Promise<ATSCompensationMeeting | null>;
  findByApplicationId(applicationId: string): Promise<ATSCompensationMeeting[]>;
  update(id: string, updateData: Partial<ATSCompensationMeeting>): Promise<ATSCompensationMeeting | null>;
  delete(id: string): Promise<boolean>;
}


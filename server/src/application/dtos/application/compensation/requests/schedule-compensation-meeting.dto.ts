import { z } from 'zod';

export const ScheduleCompensationMeetingSchema = z.object({
  type: z.enum(['call', 'online', 'in-person']),
  date: z.string(),
  time: z.string(),
  videoType: z.enum(['in-app', 'external']).optional(),
  webrtcRoomId: z.string().optional(),
  location: z.string().optional(),
  meetingLink: z.string().url().optional(),
  notes: z.string().optional(),
});

export type ScheduleCompensationMeetingRequestDto = z.infer<typeof ScheduleCompensationMeetingSchema> & {
  applicationId: string;
  performedBy: string;
};



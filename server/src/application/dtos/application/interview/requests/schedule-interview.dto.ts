import { z } from 'zod';

export const ScheduleInterviewRequestDtoSchema = z.object({
  applicationId: z.string().min(1, 'Application ID is required'),
  title: z.string().min(1, 'Title is required'),
  scheduledDate: z.union([z.string().datetime(), z.date()]),
  type: z.enum(['online', 'offline']),
  videoType: z.enum(['in-app', 'external']).optional(),
  webrtcRoomId: z.string().optional(),
  meetingLink: z.string().url().optional(),
  location: z.string().optional(),
});

export type ScheduleInterviewRequestDto = z.infer<typeof ScheduleInterviewRequestDtoSchema> & {
  userId: string;
};

// Alias for backward compatibility with controllers
export const ScheduleInterviewDtoSchema = ScheduleInterviewRequestDtoSchema;
export type ScheduleInterviewDto = ScheduleInterviewRequestDto;

import { z } from 'zod';

export const UpdateCompensationMeetingStatusSchema = z.object({
  status: z.enum(['scheduled', 'completed', 'cancelled']),
});

export type UpdateCompensationMeetingStatusRequestDto = z.infer<typeof UpdateCompensationMeetingStatusSchema> & {
    applicationId: string;
    meetingId: string;
    performedBy: string;
};

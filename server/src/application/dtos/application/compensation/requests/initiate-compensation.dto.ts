import { z } from 'zod';

export const InitiateCompensationSchema = z.object({
  candidateExpected: z.string().min(1, 'Candidate expected compensation is required'),
  notes: z.string().optional(),
});

export type InitiateCompensationRequestDto = z.infer<typeof InitiateCompensationSchema> & {
  applicationId: string;
  performedBy: string;
};



import { z } from 'zod';

export const UpdateCompensationSchema = z.object({
  candidateExpected: z.string().optional(),
  companyProposed: z.string().optional(),
  expectedJoining: z.string().transform((str) => new Date(str)).or(z.date()).optional(),
  benefits: z.array(z.string()).optional(),
  finalAgreed: z.string().optional(),
  approvedAt: z.string().transform((str) => new Date(str)).or(z.date()).optional(),
  approvedBy: z.string().optional(),
  approvedByName: z.string().optional(),
  notes: z.string().optional(),
});

export type UpdateCompensationRequestDto = z.infer<typeof UpdateCompensationSchema> & {
  applicationId: string;
  performedBy: string;
};


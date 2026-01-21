import { z } from 'zod';

export const AddCompensationNoteRequestDtoSchema = z.object({
    note: z.string().min(1, 'Note is required'),
});

export type AddCompensationNoteRequestDto = z.infer<typeof AddCompensationNoteRequestDtoSchema>;

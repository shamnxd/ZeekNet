import { z } from 'zod';

const GetCompanyContactDto = z.object({
  userId: z.string(),
});

const urlSchema = z.string().optional().refine((val) => {
  if (!val || val.trim() === '') return true;
  try {
    const url = val.startsWith('http') ? val : `https://${val}`;
    new URL(url);
    return true;
  } catch {
    return false;
  }
}, {
  message: 'Invalid url',
});

const UpsertCompanyContactDto = z.object({
  userId: z.string(),
  twitterLink: urlSchema,
  facebookLink: urlSchema,
  linkedin: urlSchema,
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
});

const UpdateCompanyContactDto = UpsertCompanyContactDto;

export { GetCompanyContactDto, UpsertCompanyContactDto, UpdateCompanyContactDto };

export type GetCompanyContactRequestDto = z.infer<typeof GetCompanyContactDto>;
export type UpsertCompanyContactRequestDto = z.infer<typeof UpsertCompanyContactDto>;
export type UpdateCompanyContactDto = z.infer<typeof UpdateCompanyContactDto>;

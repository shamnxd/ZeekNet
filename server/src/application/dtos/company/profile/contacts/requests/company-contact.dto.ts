import { z } from 'zod';

const GetCompanyContactDto = z.object({
  userId: z.string(),
});

const UpsertCompanyContactDto = z.object({
  userId: z.string(),
  twitterLink: z.string().url().optional(),
  facebookLink: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

const UpdateCompanyContactDto = UpsertCompanyContactDto;

export { GetCompanyContactDto, UpsertCompanyContactDto, UpdateCompanyContactDto };

export type GetCompanyContactRequestDto = z.infer<typeof GetCompanyContactDto>;
export type UpsertCompanyContactRequestDto = z.infer<typeof UpsertCompanyContactDto>;
export type UpdateCompanyContactDto = z.infer<typeof UpdateCompanyContactDto>;

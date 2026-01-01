import { z } from 'zod';

const CreateCompanyContactDto = z.object({
  companyId: z.string().optional(),
  twitterLink: z.string().url().optional(),
  facebookLink: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

const UpdateCompanyContactDto = CreateCompanyContactDto.partial();

export { UpdateCompanyContactDto };

export type UpdateCompanyContactDto = z.infer<typeof UpdateCompanyContactDto>;

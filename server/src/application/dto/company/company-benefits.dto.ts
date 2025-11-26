import { z } from 'zod';

const CreateCompanyBenefitsDtoSchema = z.object({
  companyId: z.string().optional(),
  perk: z.string().min(1, 'Perk name cannot be empty'),
  description: z.string().optional(),
});

const UpdateCompanyBenefitsDtoSchema = CreateCompanyBenefitsDtoSchema.partial();

export { CreateCompanyBenefitsDtoSchema as CreateCompanyBenefitsDto, UpdateCompanyBenefitsDtoSchema as UpdateCompanyBenefitsDto };

export type CreateCompanyBenefitsRequestDto = z.infer<typeof CreateCompanyBenefitsDtoSchema>;
export type UpdateCompanyBenefitsRequestDto = z.infer<typeof UpdateCompanyBenefitsDtoSchema>;
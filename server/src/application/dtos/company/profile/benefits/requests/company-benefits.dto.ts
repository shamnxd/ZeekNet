import { z } from 'zod';

const GetCompanyBenefitsDtoSchema = z.object({
  userId: z.string(),
});

const CreateCompanyBenefitsDtoSchema = z.object({
  perk: z.string().min(1, 'Perk name cannot be empty'),
  description: z.string().optional(),
});

const UpdateCompanyBenefitsDtoSchema = z.object({
  benefitId: z.string().min(1, 'Benefit ID is required'),
  perk: z.string().min(1, 'Perk name cannot be empty').optional(),
  description: z.string().optional(),
});

const DeleteCompanyBenefitsDtoSchema = z.object({
  userId: z.string(),
  benefitId: z.string(),
});

export {
  GetCompanyBenefitsDtoSchema as GetCompanyBenefitsDto,
  CreateCompanyBenefitsDtoSchema as CreateCompanyBenefitsDto,
  UpdateCompanyBenefitsDtoSchema as UpdateCompanyBenefitsDto,
  DeleteCompanyBenefitsDtoSchema as DeleteCompanyBenefitsDto,
};

export type GetCompanyBenefitsRequestDto = z.infer<typeof GetCompanyBenefitsDtoSchema>;
export type CreateCompanyBenefitsRequestDto = z.infer<typeof CreateCompanyBenefitsDtoSchema> & {
  userId: string;
};
export type UpdateCompanyBenefitsRequestDto = z.infer<typeof UpdateCompanyBenefitsDtoSchema> & {
  userId: string;
};
export type DeleteCompanyBenefitsRequestDto = z.infer<typeof DeleteCompanyBenefitsDtoSchema>;

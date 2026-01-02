import { z } from 'zod';

const CreateCompanyTechStackDtoSchema = z.object({
  companyId: z.string().optional(),
  techStack: z.string().min(1, 'Tech stack name cannot be empty'),
});

const UpdateCompanyTechStackDtoSchema = CreateCompanyTechStackDtoSchema;

export { CreateCompanyTechStackDtoSchema as CreateCompanyTechStackDto, UpdateCompanyTechStackDtoSchema as UpdateCompanyTechStackDto };

export type CreateCompanyTechStackRequestDto = z.infer<typeof CreateCompanyTechStackDtoSchema>;
export type UpdateCompanyTechStackRequestDto = z.infer<typeof UpdateCompanyTechStackDtoSchema>;

import { z } from 'zod';

const GetCompanyTechStackDtoSchema = z.object({
  userId: z.string(),
});

const CreateCompanyTechStackDtoSchema = z.object({
  name: z.string().min(1, 'Tech stack name cannot be empty'),
});

const UpdateCompanyTechStackDtoSchema = z.object({
  techStackId: z.string(),
  name: z.string().min(1, 'Tech stack name cannot be empty'),
});

const DeleteCompanyTechStackDtoSchema = z.object({
  userId: z.string(),
  techStackId: z.string(),
});

export {
  GetCompanyTechStackDtoSchema as GetCompanyTechStackDto,
  CreateCompanyTechStackDtoSchema as CreateCompanyTechStackDto,
  UpdateCompanyTechStackDtoSchema as UpdateCompanyTechStackDto,
  DeleteCompanyTechStackDtoSchema as DeleteCompanyTechStackDto,
};

export type GetCompanyTechStackRequestDto = z.infer<typeof GetCompanyTechStackDtoSchema>;
export type CreateCompanyTechStackRequestDto = z.infer<typeof CreateCompanyTechStackDtoSchema> & {
  userId: string;
};
export type UpdateCompanyTechStackRequestDto = z.infer<typeof UpdateCompanyTechStackDtoSchema> & {
  userId: string;
};
export type DeleteCompanyTechStackRequestDto = z.infer<typeof DeleteCompanyTechStackDtoSchema>;

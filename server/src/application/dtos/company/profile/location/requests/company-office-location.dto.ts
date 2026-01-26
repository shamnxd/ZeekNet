import { z } from 'zod';

export const GetCompanyOfficeLocationDto = z.object({
  userId: z.string(),
});

export const CreateCompanyOfficeLocationDto = z.object({
  location: z.string().min(1, 'Location cannot be empty'),
  officeName: z.string().optional(),
  address: z.string().optional(),
  isHeadquarters: z.boolean().default(false),
});

export const UpdateCompanyOfficeLocationDto = z.object({
  locationId: z.string().min(1, 'Location ID is required'),
  location: z.string().min(1, 'Location cannot be empty').optional(),
  officeName: z.string().optional(),
  address: z.string().optional(),
  isHeadquarters: z.boolean().optional(),
});

export const DeleteCompanyOfficeLocationDto = z.object({
  userId: z.string(),
  locationId: z.string(),
});

export type GetCompanyOfficeLocationRequestDto = z.infer<typeof GetCompanyOfficeLocationDto>;
export type CreateCompanyOfficeLocationRequestDto = z.infer<typeof CreateCompanyOfficeLocationDto> & {
  userId: string;
};
export type UpdateCompanyOfficeLocationRequestDto = z.infer<typeof UpdateCompanyOfficeLocationDto> & {
  userId: string;
};
export type DeleteCompanyOfficeLocationRequestDto = z.infer<typeof DeleteCompanyOfficeLocationDto>;

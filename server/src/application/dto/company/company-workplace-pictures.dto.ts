import { z } from 'zod';

const CreateCompanyWorkplacePicturesDtoSchema = z.object({
  companyId: z.string().optional(),
  pictureUrl: z.string().url('Must be a valid URL'),
  caption: z.string().optional(),
});

const UpdateCompanyWorkplacePicturesDtoSchema = CreateCompanyWorkplacePicturesDtoSchema.partial();

export { CreateCompanyWorkplacePicturesDtoSchema as CreateCompanyWorkplacePicturesDto, UpdateCompanyWorkplacePicturesDtoSchema as UpdateCompanyWorkplacePicturesDto };

export type CreateCompanyWorkplacePicturesRequestDto = z.infer<typeof CreateCompanyWorkplacePicturesDtoSchema>;
export type UpdateCompanyWorkplacePicturesRequestDto = z.infer<typeof UpdateCompanyWorkplacePicturesDtoSchema>;
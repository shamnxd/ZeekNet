import { z } from 'zod';

const CreateCompanyWorkplacePicturesDtoSchema = z.object({
  pictureUrl: z.string().min(1, 'Picture URL is required'),
  caption: z.string().optional(),
});

const UpdateCompanyWorkplacePicturesDtoSchema = z.object({
  pictureUrl: z.string().min(1, 'Picture URL is required'),
  caption: z.string().optional(),
});

export {
  CreateCompanyWorkplacePicturesDtoSchema as CreateCompanyWorkplacePicturesDto,
  UpdateCompanyWorkplacePicturesDtoSchema as UpdateCompanyWorkplacePicturesDto,
};

export type CreateCompanyWorkplacePicturesRequestDto = z.infer<typeof CreateCompanyWorkplacePicturesDtoSchema>;
export type UpdateCompanyWorkplacePicturesRequestDto = z.infer<typeof UpdateCompanyWorkplacePicturesDtoSchema>;

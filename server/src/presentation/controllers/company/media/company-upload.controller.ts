import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { IUploadBusinessLicenseUseCase } from 'src/domain/interfaces/use-cases/company/media/IUploadBusinessLicenseUseCase';
import { IUploadWorkplacePictureUseCase } from 'src/domain/interfaces/use-cases/company/media/IUploadWorkplacePictureUseCase';
import { IDeleteImageUseCase } from 'src/domain/interfaces/use-cases/company/media/IDeleteImageUseCase';
import { DeleteImageDtoSchema } from 'src/application/dtos/company/media/requests/delete-image.dto';
import { formatZodErrors, handleAsyncError, handleValidationError, sendSuccessResponse } from 'src/shared/utils';
import { SUCCESS, VALIDATION } from 'src/shared/constants/messages';
import { TYPES } from 'src/shared/constants/types';

@injectable()
export class CompanyUploadController {
  constructor(
    @inject(TYPES.UploadBusinessLicenseUseCase) private readonly _uploadBusinessLicenseUseCase: IUploadBusinessLicenseUseCase,
    @inject(TYPES.UploadWorkplacePictureUseCase) private readonly _uploadWorkplacePictureUseCase: IUploadWorkplacePictureUseCase,
    @inject(TYPES.DeleteImageUseCase) private readonly _deleteImageUseCase: IDeleteImageUseCase,
  ) { }

  uploadBusinessLicense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const file = req.file;

      if (!file) {
        return handleValidationError(VALIDATION.REQUIRED('Business license'), next);
      }

      const result = await this._uploadBusinessLicenseUseCase.execute({ buffer: file.buffer, originalname: file.originalname, mimetype: file.mimetype });
      sendSuccessResponse(res, SUCCESS.CREATED('Business license'), result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  uploadWorkplacePicture = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const file = req.file;

      if (!file) {
        return handleValidationError(VALIDATION.REQUIRED('Workplace picture'), next);
      }

      const result = await this._uploadWorkplacePictureUseCase.execute({ buffer: file.buffer, originalname: file.originalname, mimetype: file.mimetype });
      sendSuccessResponse(res, SUCCESS.CREATED('Workplace picture'), result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = DeleteImageDtoSchema.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      await this._deleteImageUseCase.execute(parsed.data.imageUrl);
      sendSuccessResponse(res, SUCCESS.DELETED('Image'), null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}



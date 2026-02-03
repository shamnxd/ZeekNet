import { Request, Response, NextFunction } from 'express';
import { handleValidationError, handleAsyncError, sendSuccessResponse } from 'src/shared/utils/presentation/controller.utils';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';
import { IUploadBusinessLicenseUseCase } from 'src/domain/interfaces/use-cases/company/media/IUploadBusinessLicenseUseCase';
import { IUploadWorkplacePictureUseCase } from 'src/domain/interfaces/use-cases/company/media/IUploadWorkplacePictureUseCase';
import { IDeleteImageUseCase } from 'src/domain/interfaces/use-cases/company/media/IDeleteImageUseCase';
import { DeleteImageDtoSchema } from 'src/application/dtos/company/media/requests/delete-image.dto';

export class CompanyUploadController {
  constructor(
    private readonly _uploadBusinessLicenseUseCase: IUploadBusinessLicenseUseCase,
    private readonly _uploadWorkplacePictureUseCase: IUploadWorkplacePictureUseCase,
    private readonly _deleteImageUseCase: IDeleteImageUseCase,
  ) {}

  uploadBusinessLicense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const file = req.file;

      if (!file) {
        return handleValidationError('No business license uploaded', next);
      }

      const result = await this._uploadBusinessLicenseUseCase.execute({ buffer: file.buffer, originalname: file.originalname, mimetype: file.mimetype });
      sendSuccessResponse(res, 'Business license uploaded successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  uploadWorkplacePicture = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const file = req.file;

      if (!file) {
        return handleValidationError('No workplace picture uploaded', next);
      }

      const result = await this._uploadWorkplacePictureUseCase.execute({ buffer: file.buffer, originalname: file.originalname, mimetype: file.mimetype });
      sendSuccessResponse(res, 'Workplace picture uploaded successfully', result);
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
      sendSuccessResponse(res, 'Image deleted successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}


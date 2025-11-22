import { Request, Response, NextFunction } from 'express';
import { handleValidationError, handleAsyncError, sendSuccessResponse } from '../../../shared/utils/controller.utils';
import { UploadBusinessLicenseUseCase } from '../../../application/use-cases/company/upload-business-license.use-case';
import { UploadWorkplacePictureUseCase } from '../../../application/use-cases/company/upload-workplace-picture.use-case';
import { DeleteImageUseCase } from '../../../application/use-cases/company/delete-image.use-case';
import { DeleteImageDto } from '../../../application/dto/company/delete-image.dto';

export class CompanyUploadController {
  constructor(
    private readonly _uploadBusinessLicenseUseCase: UploadBusinessLicenseUseCase,
    private readonly _uploadWorkplacePictureUseCase: UploadWorkplacePictureUseCase,
    private readonly _deleteImageUseCase: DeleteImageUseCase,
  ) {}

  uploadBusinessLicense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const file = req.file;

      if (!file) {
        return handleValidationError('No business license uploaded', next);
      }

      const result = await this._uploadBusinessLicenseUseCase.execute(file.buffer, file.originalname, file.mimetype);
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

      const result = await this._uploadWorkplacePictureUseCase.execute(file.buffer, file.originalname, file.mimetype);
      sendSuccessResponse(res, 'Workplace picture uploaded successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = DeleteImageDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(`Invalid image deletion data: ${parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`, next);
    }

    try {
      await this._deleteImageUseCase.execute(parsed.data.imageUrl);
      sendSuccessResponse(res, 'Image deleted successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}

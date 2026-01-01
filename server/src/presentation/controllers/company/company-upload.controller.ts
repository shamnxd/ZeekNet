import { Request, Response, NextFunction } from 'express';
import { handleValidationError, handleAsyncError, sendSuccessResponse } from '../../../shared/utils/presentation/controller.utils';
import { IUploadBusinessLicenseUseCase } from '../../../domain/interfaces/use-cases/company/IUploadBusinessLicenseUseCase';
import { IUploadWorkplacePictureUseCase } from '../../../domain/interfaces/use-cases/company/IUploadWorkplacePictureUseCase';
import { IDeleteImageUseCase } from '../../../domain/interfaces/use-cases/company/IDeleteImageUseCase';

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
    const { imageUrl } = req.body;
    if (!imageUrl || typeof imageUrl !== 'string') {
      return handleValidationError('Image URL is required and must be a string', next);
    }

    try {
      await this._deleteImageUseCase.execute(imageUrl);
      sendSuccessResponse(res, 'Image deleted successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}


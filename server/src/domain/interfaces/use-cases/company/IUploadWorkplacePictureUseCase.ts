import { UploadWorkplacePictureResult } from './UploadWorkplacePictureResult';

// be

export interface IUploadWorkplacePictureUseCase {
  execute(buffer: Buffer, originalname: string, mimetype: string): Promise<UploadWorkplacePictureResult>;
}

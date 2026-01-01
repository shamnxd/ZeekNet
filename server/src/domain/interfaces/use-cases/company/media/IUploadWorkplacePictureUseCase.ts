import { UploadWorkplacePictureResult } from 'src/application/dtos/company/media/responses/upload-workplace-picture-result.dto';
import { UploadWorkplacePictureDto } from 'src/application/dtos/company/media/requests/upload-workplace-picture.dto';

export interface IUploadWorkplacePictureUseCase {
  execute(dto: UploadWorkplacePictureDto): Promise<UploadWorkplacePictureResult>;
}


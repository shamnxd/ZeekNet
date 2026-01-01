import { UploadWorkplacePictureResult } from 'src/application/dtos/company/common/upload-workplace-picture-result.dto';
import { UploadWorkplacePictureDto } from 'src/application/dtos/company/common/upload-workplace-picture.dto';

export interface IUploadWorkplacePictureUseCase {
  execute(dto: UploadWorkplacePictureDto): Promise<UploadWorkplacePictureResult>;
}


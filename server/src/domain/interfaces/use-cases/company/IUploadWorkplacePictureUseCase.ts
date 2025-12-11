import { UploadWorkplacePictureResult } from 'src/application/dto/company/upload-workplace-picture-result.dto';
import { UploadWorkplacePictureDto } from 'src/application/dto/company/upload-workplace-picture.dto';

export interface IUploadWorkplacePictureUseCase {
  execute(dto: UploadWorkplacePictureDto): Promise<UploadWorkplacePictureResult>;
}

import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { IS3Service } from 'src/domain/interfaces/services/IS3Service';
import { ValidationError } from 'src/domain/errors/errors';
import { IDeleteImageUseCase } from 'src/domain/interfaces/use-cases/company/media/IDeleteImageUseCase';
import { VALIDATION } from 'src/shared/constants/messages';


@injectable()
export class DeleteImageUseCase implements IDeleteImageUseCase {
  constructor(
    @inject(TYPES.S3Service) private readonly _s3Service: IS3Service,
  ) {}

  async execute(imageUrl: string): Promise<void> {
    if (!imageUrl) {
      throw new ValidationError(VALIDATION.REQUIRED('Image URL'));
    }

    await this._s3Service.deleteImage(imageUrl);
  }
}

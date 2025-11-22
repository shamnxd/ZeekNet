import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { ValidationError } from '../../../domain/errors/errors';

export class DeleteImageUseCase {
  constructor(private readonly _s3Service: IS3Service) {}

  async execute(imageUrl: string): Promise<void> {
    if (!imageUrl) {
      throw new ValidationError('Image URL is required');
    }

    await this._s3Service.deleteImage(imageUrl);
  }
}

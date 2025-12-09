import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { ValidationError } from '../../../domain/errors/errors';
import { IDeleteImageUseCase } from '../../../domain/interfaces/use-cases/company/IDeleteImageUseCase';

export class DeleteImageUseCase implements IDeleteImageUseCase {
  constructor(private readonly _s3Service: IS3Service) {}

  async execute(imageUrl: string): Promise<void> {
    if (!imageUrl) {
      throw new ValidationError('Image URL is required');
    }

    await this._s3Service.deleteImage(imageUrl);
  }
}

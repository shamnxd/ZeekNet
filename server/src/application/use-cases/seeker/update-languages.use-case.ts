import { ISeekerProfileRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { IUpdateLanguagesUseCase } from '../../../domain/interfaces/use-cases/seeker/IUpdateLanguagesUseCase';
import { NotFoundError } from '../../../domain/errors/errors';

export class UpdateLanguagesUseCase implements IUpdateLanguagesUseCase {
  constructor(
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
  ) {}

  async execute(userId: string, languages: string[]): Promise<string[]> {
    
    const profile = await this._seekerProfileRepository.findOne({ userId });
    if (!profile) {
      throw new NotFoundError('Seeker profile not found');
    }

    await this._seekerProfileRepository.update(profile.id, { languages });
    return languages;
  }
}



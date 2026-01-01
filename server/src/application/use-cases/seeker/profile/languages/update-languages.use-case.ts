import { ISeekerProfileRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { IUpdateLanguagesUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/languages/IUpdateLanguagesUseCase';
import { NotFoundError } from 'src/domain/errors/errors';

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



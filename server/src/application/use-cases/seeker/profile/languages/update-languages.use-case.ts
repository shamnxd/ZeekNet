import { ISeekerProfileRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { IUpdateLanguagesUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/languages/IUpdateLanguagesUseCase';
import { NotFoundError } from 'src/domain/errors/errors';

import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR } from 'src/shared/constants/messages';


@injectable()
export class UpdateLanguagesUseCase implements IUpdateLanguagesUseCase {
  constructor(
    @inject(TYPES.SeekerProfileRepository) private readonly _seekerProfileRepository: ISeekerProfileRepository,
  ) {}

  async execute(userId: string, languages: string[]): Promise<string[]> {
    
    const profile = await this._seekerProfileRepository.findOne({ userId });
    if (!profile) {
      throw new NotFoundError(ERROR.NOT_FOUND('Seeker profile'));
    }

    await this._seekerProfileRepository.update(profile.id, { languages });
    return languages;
  }
}



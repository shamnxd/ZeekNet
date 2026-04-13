import { ISeekerProfileRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { ISeekerEducationRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerEducationRepository';
import { IRemoveEducationUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/education/IRemoveEducationUseCase';
import { NotFoundError } from 'src/domain/errors/errors';

import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR } from 'src/shared/constants/messages';


@injectable()
export class RemoveEducationUseCase implements IRemoveEducationUseCase {
  constructor(
    @inject(TYPES.SeekerProfileRepository) private readonly _seekerProfileRepository: ISeekerProfileRepository,
    @inject(TYPES.SeekerEducationRepository) private readonly _seekerEducationRepository: ISeekerEducationRepository,
  ) {}

  async execute(userId: string, educationId: string): Promise<void> {
    
    const profile = await this._seekerProfileRepository.findOne({ userId });
    if (!profile) {
      throw new NotFoundError(ERROR.NOT_FOUND('Seeker profile'));
    }

    const education = await this._seekerEducationRepository.findById(educationId);
    if (!education) {
      throw new NotFoundError(ERROR.NOT_FOUND('Education'));
    }

    const userEducation = await this._seekerEducationRepository.findBySeekerProfileId(profile.id);
    if (!userEducation.find(edu => edu.id === educationId)) {
      throw new NotFoundError(ERROR.NOT_FOUND('Education'));
    }

    await this._seekerEducationRepository.delete(educationId);
  }
}



import { ISeekerProfileRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { ISeekerExperienceRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerExperienceRepository';
import { IRemoveExperienceUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/experience/IRemoveExperienceUseCase';
import { NotFoundError } from 'src/domain/errors/errors';

import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR } from 'src/shared/constants/messages';


@injectable()
export class RemoveExperienceUseCase implements IRemoveExperienceUseCase {
  constructor(
    @inject(TYPES.SeekerProfileRepository) private readonly _seekerProfileRepository: ISeekerProfileRepository,
    @inject(TYPES.SeekerExperienceRepository) private readonly _seekerExperienceRepository: ISeekerExperienceRepository,
  ) {}

  async execute(userId: string, experienceId: string): Promise<void> {
    
    const profile = await this._seekerProfileRepository.findOne({ userId });
    if (!profile) {
      throw new NotFoundError(ERROR.NOT_FOUND('Seeker profile'));
    }

    const experience = await this._seekerExperienceRepository.findById(experienceId);
    if (!experience) {
      throw new NotFoundError(ERROR.NOT_FOUND('Experience'));
    }

    const userExperiences = await this._seekerExperienceRepository.findBySeekerProfileId(profile.id);
    if (!userExperiences.find(exp => exp.id === experienceId)) {
      throw new NotFoundError(ERROR.NOT_FOUND('Experience'));
    }

    await this._seekerExperienceRepository.delete(experienceId);
  }
}



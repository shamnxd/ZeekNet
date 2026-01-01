import { ISeekerProfileRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { ISeekerExperienceRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerExperienceRepository';
import { IRemoveExperienceUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/experience/IRemoveExperienceUseCase';
import { NotFoundError } from 'src/domain/errors/errors';

export class RemoveExperienceUseCase implements IRemoveExperienceUseCase {
  constructor(
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
    private readonly _seekerExperienceRepository: ISeekerExperienceRepository,
  ) {}

  async execute(userId: string, experienceId: string): Promise<void> {
    
    const profile = await this._seekerProfileRepository.findOne({ userId });
    if (!profile) {
      throw new NotFoundError('Seeker profile not found');
    }

    const experience = await this._seekerExperienceRepository.findById(experienceId);
    if (!experience) {
      throw new NotFoundError('Experience not found');
    }

    const userExperiences = await this._seekerExperienceRepository.findBySeekerProfileId(profile.id);
    if (!userExperiences.find(exp => exp.id === experienceId)) {
      throw new NotFoundError('Experience not found');
    }

    await this._seekerExperienceRepository.delete(experienceId);
  }
}



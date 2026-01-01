import { ISeekerProfileRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { ISeekerEducationRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerEducationRepository';
import { IRemoveEducationUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/education/IRemoveEducationUseCase';
import { NotFoundError } from 'src/domain/errors/errors';

export class RemoveEducationUseCase implements IRemoveEducationUseCase {
  constructor(
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
    private readonly _seekerEducationRepository: ISeekerEducationRepository,
  ) {}

  async execute(userId: string, educationId: string): Promise<void> {
    
    const profile = await this._seekerProfileRepository.findOne({ userId });
    if (!profile) {
      throw new NotFoundError('Seeker profile not found');
    }

    const education = await this._seekerEducationRepository.findById(educationId);
    if (!education) {
      throw new NotFoundError('Education not found');
    }

    const userEducation = await this._seekerEducationRepository.findBySeekerProfileId(profile.id);
    if (!userEducation.find(edu => edu.id === educationId)) {
      throw new NotFoundError('Education not found');
    }

    await this._seekerEducationRepository.delete(educationId);
  }
}



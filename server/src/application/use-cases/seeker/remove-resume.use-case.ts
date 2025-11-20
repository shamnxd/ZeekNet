import { ISeekerProfileRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { IRemoveResumeUseCase } from '../../../domain/interfaces/use-cases/ISeekerUseCases';
import { NotFoundError } from '../../../domain/errors/errors';

export class RemoveResumeUseCase implements IRemoveResumeUseCase {
  constructor(
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    
    const profile = await this._seekerProfileRepository.findOne({ userId });
    if (!profile) {
      throw new NotFoundError('Seeker profile not found');
    }

    if (!profile.resume) {
      throw new NotFoundError('No resume found to remove');
    }

    await this._seekerProfileRepository.removeResume(userId);
  }
}



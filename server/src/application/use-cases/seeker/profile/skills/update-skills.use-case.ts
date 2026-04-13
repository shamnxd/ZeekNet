import { ISeekerProfileRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { IUpdateSkillsUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/skills/IUpdateSkillsUseCase';
import { NotFoundError } from 'src/domain/errors/errors';

import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR } from 'src/shared/constants/messages';


@injectable()
export class UpdateSkillsUseCase implements IUpdateSkillsUseCase {
  constructor(
    @inject(TYPES.SeekerProfileRepository) private readonly _seekerProfileRepository: ISeekerProfileRepository,
  ) {}

  async execute(userId: string, skills: string[]): Promise<string[]> {
    
    const profile = await this._seekerProfileRepository.findOne({ userId });
    if (!profile) {
      throw new NotFoundError(ERROR.NOT_FOUND('Seeker profile'));
    }

    const uniqueSkills = [...new Set(skills.filter(skill => skill.trim().length > 0))];

    await this._seekerProfileRepository.update(profile.id, { skills: uniqueSkills });
    return uniqueSkills;
  }
}



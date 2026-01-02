import { ISeekerProfileRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { IUpdateSkillsUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/skills/IUpdateSkillsUseCase';
import { NotFoundError } from 'src/domain/errors/errors';

export class UpdateSkillsUseCase implements IUpdateSkillsUseCase {
  constructor(
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
  ) {}

  async execute(userId: string, skills: string[]): Promise<string[]> {
    
    const profile = await this._seekerProfileRepository.findOne({ userId });
    if (!profile) {
      throw new NotFoundError('Seeker profile not found');
    }

    const uniqueSkills = [...new Set(skills.filter(skill => skill.trim().length > 0))];

    await this._seekerProfileRepository.update(profile.id, { skills: uniqueSkills });
    return uniqueSkills;
  }
}



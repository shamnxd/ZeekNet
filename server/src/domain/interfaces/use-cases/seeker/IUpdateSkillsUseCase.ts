
export interface IUpdateSkillsUseCase {
  execute(userId: string, skills: string[]): Promise<string[]>;
}

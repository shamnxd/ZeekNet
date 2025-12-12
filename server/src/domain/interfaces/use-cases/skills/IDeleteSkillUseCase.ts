export interface IDeleteSkillUseCase {
  execute(skillId: string): Promise<boolean>;
}

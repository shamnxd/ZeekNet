
export interface IRemoveExperienceUseCase {
  execute(userId: string, experienceId: string): Promise<void>;
}

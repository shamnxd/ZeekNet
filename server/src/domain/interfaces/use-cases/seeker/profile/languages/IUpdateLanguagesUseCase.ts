
export interface IUpdateLanguagesUseCase {
  execute(userId: string, languages: string[]): Promise<string[]>;
}

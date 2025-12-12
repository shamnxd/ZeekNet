
export interface IDeleteJobPostingUseCase {
  execute(id: string, userId: string): Promise<void>;
}

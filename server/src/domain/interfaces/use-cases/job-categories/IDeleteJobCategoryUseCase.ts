
export interface IDeleteJobCategoryUseCase {
  execute(id: string): Promise<boolean>;
}

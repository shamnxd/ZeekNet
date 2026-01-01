
export interface IIncrementJobViewCountUseCase {
  execute(id: string, userRole?: string): Promise<void>;
}

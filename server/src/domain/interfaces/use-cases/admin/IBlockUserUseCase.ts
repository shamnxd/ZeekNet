export interface IBlockUserUseCase {
  execute(userId: string, isBlocked: boolean): Promise<void>;
}


export interface IUpdateUserRefreshTokenUseCase {
  execute(userId: string, hashedRefreshToken: string): Promise<void>;
}

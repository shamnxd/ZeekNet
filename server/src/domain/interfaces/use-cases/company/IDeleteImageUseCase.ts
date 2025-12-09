
export interface IDeleteImageUseCase {
  execute(imageUrl: string): Promise<void>;
}



interface IGetCountSameJobbsUseCase {
    execute(jobrole: string): Promise<number>;
}
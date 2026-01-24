export interface IReopenJobUseCase {
    execute(params: { userId: string; jobId: string; additionalVacancies: number }): Promise<void>;
}

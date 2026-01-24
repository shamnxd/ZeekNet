export interface ICloseJobManuallyUseCase {
    execute(params: { userId: string; jobId: string }): Promise<void>;
}

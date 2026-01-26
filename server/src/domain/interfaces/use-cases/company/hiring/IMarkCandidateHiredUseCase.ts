export interface MarkCandidateHiredDto {
    userId: string;
    applicationId: string;
}

export interface IMarkCandidateHiredUseCase {
    execute(dto: MarkCandidateHiredDto): Promise<void>;
}

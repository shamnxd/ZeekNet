import { MarkCandidateHiredDto } from 'src/application/use-cases/company/hiring/mark-candidate-hired.use-case';

export interface IMarkCandidateHiredUseCase {
    execute(dto: MarkCandidateHiredDto): Promise<void>;
}

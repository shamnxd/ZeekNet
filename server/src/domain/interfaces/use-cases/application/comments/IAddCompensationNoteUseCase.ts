import { ATSComment } from 'src/domain/entities/ats-comment.entity';

export interface AddCompensationNoteParamsDto {
    applicationId: string;
    note: string;
    addedBy: string;
    addedByName: string;
}

export interface IAddCompensationNoteUseCase {
    execute(params: AddCompensationNoteParamsDto): Promise<ATSComment>;
}

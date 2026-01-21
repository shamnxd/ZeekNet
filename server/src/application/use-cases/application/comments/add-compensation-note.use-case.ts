import { v4 as uuidv4 } from 'uuid';
import { IAddCompensationNoteUseCase, AddCompensationNoteParamsDto } from 'src/domain/interfaces/use-cases/application/comments/IAddCompensationNoteUseCase';
import { IATSCommentRepository } from 'src/domain/interfaces/repositories/ats/IATSCommentRepository';
import { IActivityLoggerService } from 'src/domain/interfaces/services/IActivityLoggerService';
import { ATSComment } from 'src/domain/entities/ats-comment.entity';
import { ATSStage } from 'src/domain/enums/ats-stage.enum';

export class AddCompensationNoteUseCase implements IAddCompensationNoteUseCase {
    constructor(
        private commentRepository: IATSCommentRepository,
        private activityLoggerService: IActivityLoggerService,
    ) { }

    async execute(params: AddCompensationNoteParamsDto): Promise<ATSComment> {
        const userName = params.addedByName || 'Unknown User';

        const comment = ATSComment.create({
            id: uuidv4(),
            applicationId: params.applicationId,
            comment: params.note,
            stage: ATSStage.COMPENSATION,
            addedBy: params.addedBy,
            addedByName: userName,
        });

        const savedComment = await this.commentRepository.create(comment);

        await this.activityLoggerService.logCommentAddedActivity({
            applicationId: params.applicationId,
            commentId: savedComment.id,
            comment: params.note,
            stage: ATSStage.COMPENSATION,
            performedBy: params.addedBy,
            performedByName: userName,
        });

        return savedComment;
    }
}

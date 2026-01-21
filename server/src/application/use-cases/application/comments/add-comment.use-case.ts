import { v4 as uuidv4 } from 'uuid';
import { IAddCommentUseCase } from 'src/domain/interfaces/use-cases/application/comments/IAddCommentUseCase';
import { IATSCommentRepository } from 'src/domain/interfaces/repositories/ats/IATSCommentRepository';
import { IActivityLoggerService } from 'src/domain/interfaces/services/IActivityLoggerService';
import { ATSComment } from 'src/domain/entities/ats-comment.entity';
import { AddCommentParamsDto } from 'src/application/dtos/application/comments/requests/add-comment-params.dto';

export class AddCommentUseCase implements IAddCommentUseCase {
  constructor(
    private commentRepository: IATSCommentRepository,
    private activityLoggerService: IActivityLoggerService,
  ) { }

  async execute(params: AddCommentParamsDto): Promise<ATSComment> {
    const userName = params.addedByName || 'Unknown User';

    const comment = ATSComment.create({
      id: uuidv4(),
      applicationId: params.applicationId,
      comment: params.comment,
      addedBy: params.addedBy,
      addedByName: userName,
      stage: params.stage,
      subStage: params.subStage,
    });

    const savedComment = await this.commentRepository.create(comment);

    await this.activityLoggerService.logCommentAddedActivity({
      applicationId: params.applicationId,
      commentId: savedComment.id,
      comment: params.comment,
      stage: params.stage,
      subStage: params.subStage,
      performedBy: params.addedBy,
      performedByName: userName,
    });

    return savedComment;
  }
}

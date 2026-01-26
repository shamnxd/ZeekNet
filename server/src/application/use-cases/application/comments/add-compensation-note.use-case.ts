import { v4 as uuidv4 } from 'uuid';
import { IAddCompensationNoteUseCase, AddCompensationNoteParamsDto } from 'src/domain/interfaces/use-cases/application/comments/IAddCompensationNoteUseCase';
import { IATSCommentRepository } from 'src/domain/interfaces/repositories/ats/IATSCommentRepository';
import { IActivityLoggerService } from 'src/domain/interfaces/services/IActivityLoggerService';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { ATSComment } from 'src/domain/entities/ats-comment.entity';
import { ATSStage } from 'src/domain/enums/ats-stage.enum';
import { NotFoundError } from 'src/domain/errors/errors';
import { ATSCommentResponseDto } from 'src/application/dtos/application/comments/responses/ats-comment-response.dto';
import { ATSCommentMapper } from 'src/application/mappers/ats/ats-comment.mapper';

export class AddCompensationNoteUseCase implements IAddCompensationNoteUseCase {
  constructor(
        private commentRepository: IATSCommentRepository,
        private activityLoggerService: IActivityLoggerService,
        private userRepository: IUserRepository,
  ) { }

  async execute(params: AddCompensationNoteParamsDto): Promise<ATSComment> {
    const user = await this.userRepository.findById(params.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const userName = user.email || 'Unknown User';

    const comment = ATSComment.create({
      id: uuidv4(),
      applicationId: params.applicationId,
      comment: params.note,
      stage: ATSStage.COMPENSATION,
      addedBy: params.userId,
      addedByName: userName,
    });

    const savedComment = await this.commentRepository.create(comment);

    await this.activityLoggerService.logCommentAddedActivity({
      applicationId: params.applicationId,
      commentId: savedComment.id,
      comment: params.note,
      stage: ATSStage.COMPENSATION,
      performedBy: params.userId,
      performedByName: userName,
    });

    return ATSCommentMapper.toResponse(savedComment);
  }
}

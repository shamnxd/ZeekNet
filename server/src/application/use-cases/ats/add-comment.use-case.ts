import { v4 as uuidv4 } from 'uuid';
import { IAddCommentUseCase } from '../../../domain/interfaces/use-cases/ats/IAddCommentUseCase';
import { IATSCommentRepository } from '../../../domain/interfaces/repositories/ats/IATSCommentRepository';
import { IActivityLoggerService } from '../../../domain/interfaces/services/IActivityLoggerService';
import { ATSComment } from '../../../domain/entities/ats-comment.entity';
import { ATSStage, ATSSubStage } from '../../../domain/enums/ats-stage.enum';

export class AddCommentUseCase implements IAddCommentUseCase {
  constructor(
    private commentRepository: IATSCommentRepository,
    private activityLoggerService: IActivityLoggerService,
  ) {}

  async execute(data: {
    applicationId: string;
    comment: string;
    stage: ATSStage;
    subStage?: ATSSubStage;
    addedBy: string;
    addedByName: string;
  }): Promise<ATSComment> {
    // Create comment
    const comment = ATSComment.create({
      id: uuidv4(),
      applicationId: data.applicationId,
      comment: data.comment,
      addedBy: data.addedBy,
      addedByName: data.addedByName,
      stage: data.stage,
      subStage: data.subStage,
    });

    const savedComment = await this.commentRepository.create(comment);

    // Log activity
    await this.activityLoggerService.logCommentAddedActivity({
      applicationId: data.applicationId,
      commentId: savedComment.id,
      comment: data.comment,
      stage: data.stage,
      subStage: data.subStage,
      performedBy: data.addedBy,
      performedByName: data.addedByName,
    });

    return savedComment;
  }
}

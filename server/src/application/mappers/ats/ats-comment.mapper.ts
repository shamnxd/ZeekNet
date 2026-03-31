import { ATSComment } from 'src/domain/entities/ats-comment.entity';
import { ATSCommentResponseDto } from 'src/application/dtos/application/comments/responses/ats-comment-response.dto';

export class ATSCommentMapper {
  static toResponse(comment: ATSComment): ATSCommentResponseDto {
    return {
      id: comment.id,
      applicationId: comment.applicationId,
      comment: comment.comment,
      stage: comment.stage,
      subStage: comment.subStage,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }

  static toResponseList(comments: ATSComment[]): ATSCommentResponseDto[] {
    return comments.map((comment) => this.toResponse(comment));
  }
}


import { ATSTechnicalTask } from 'src/domain/entities/ats-technical-task.entity';
import { ATSTechnicalTaskResponseDto } from 'src/application/dtos/application/task/responses/ats-technical-task-response.dto';

export class ATSTechnicalTaskMapper {
  static toResponse(task: ATSTechnicalTask): ATSTechnicalTaskResponseDto {
    return {
      id: task.id,
      applicationId: task.applicationId,
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      documentUrl: task.documentUrl,
      documentFilename: task.documentFilename,
      submissionUrl: task.submissionUrl,
      submissionFilename: task.submissionFilename,
      submissionLink: task.submissionLink,
      submissionNote: task.submissionNote,
      submittedAt: task.submittedAt,
      status: task.status,
      feedback: task.feedback,
      score: task.rating,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }

  static toResponseList(tasks: ATSTechnicalTask[]): ATSTechnicalTaskResponseDto[] {
    return tasks.map((task) => this.toResponse(task));
  }
}

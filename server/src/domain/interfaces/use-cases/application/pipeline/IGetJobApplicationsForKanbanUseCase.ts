import { JobApplicationsKanbanResponseDto } from 'src/application/dtos/application/pipeline/responses/job-applications-kanban-response.dto';
import { GetJobApplicationsKanbanDto } from 'src/application/dtos/application/requests/get-job-applications-kanban.dto';

export interface IGetJobApplicationsForKanbanUseCase {
  execute(dto: GetJobApplicationsKanbanDto): Promise<JobApplicationsKanbanResponseDto>;
}




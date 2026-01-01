import { CreateJobApplicationDto } from 'src/application/dtos/seeker/applications/requests/create-job-application.dto';
import { z } from 'zod';


export interface ICreateJobApplicationUseCase {
  execute(data: z.infer<typeof CreateJobApplicationDto> & { seekerId?: string }, resumeBuffer?: Buffer, mimeType?: string): Promise<{ id: string; }>;
}


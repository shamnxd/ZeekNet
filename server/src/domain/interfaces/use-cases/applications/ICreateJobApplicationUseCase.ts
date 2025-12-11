import { CreateJobApplicationDto } from 'src/application/dto/application/create-job-application.dto';
import { z } from 'zod';


export interface ICreateJobApplicationUseCase {
  execute(data: z.infer<typeof CreateJobApplicationDto> & { seekerId?: string }): Promise<{ id: string; }>;
}

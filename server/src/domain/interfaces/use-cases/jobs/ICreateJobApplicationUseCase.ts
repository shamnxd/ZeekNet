import { CreateJobApplicationData } from '../applications/CreateJobApplicationData';


export interface ICreateJobApplicationUseCase {
  execute(data: CreateJobApplicationData): Promise<{ id: string; }>;
}

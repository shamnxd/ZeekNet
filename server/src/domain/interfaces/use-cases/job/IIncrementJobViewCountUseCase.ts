import { IncrementJobViewCountDto } from 'src/application/dtos/job/requests/increment-view.dto';

export interface IIncrementJobViewCountUseCase {
  execute(dto: IncrementJobViewCountDto): Promise<void>;
}

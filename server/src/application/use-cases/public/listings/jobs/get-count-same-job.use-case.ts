import { IJobPostingRepository } from "src/domain/interfaces/repositories/job/IJobPostingRepository";

export class GetCountSameJobUseCase implements IGetCountSameJobbsUseCase {
  constructor(
    private readonly _jobPostingRepository: IJobPostingRepository,
  ) { }

  async execute(jobrole: string): Promise<number> {
    
    const jobsCount = this._jobPostingRepository.countDocuments({jobrole: jobrole})
    return jobsCount;
}
}
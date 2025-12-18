import type { JobPostingResponse } from "@/interfaces/job/job-posting-response.interface";

export interface JobCardProps {
  job: JobPostingResponse;
  onViewDetails?: (jobId: string) => void;
}

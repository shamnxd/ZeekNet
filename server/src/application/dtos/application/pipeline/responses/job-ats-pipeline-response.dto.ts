export interface JobATSPipelineResponseDto {
  jobId: string;
  enabledStages: string[];
  pipelineConfig: Record<string, string[]>;
}

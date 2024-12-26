import { ATSStage } from '@/constants/ats-stages';

export interface ATSPipelineConfig {
  jobId: string;
  enabledStages: ATSStage[];
  pipelineConfig: Record<string, string[]>;
}

export interface ApplicationKanbanItem {
  id: string;
  seekerId: string;
  seekerName?: string;
  seekerAvatar?: string;
  jobTitle?: string;
  atsScore?: number;
  subStage: string;
  appliedDate: string;
}

export interface ApplicationsKanbanResponse {
  [stage: string]: ApplicationKanbanItem[];
}

export interface MoveApplicationStageRequest {
  nextStage: ATSStage;
  subStage?: string;
  comment?: string;
}

export interface UpdateSubStageRequest {
  subStage: string;
  comment?: string;
}




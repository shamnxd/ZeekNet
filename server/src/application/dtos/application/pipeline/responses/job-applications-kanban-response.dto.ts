export interface JobApplicationKanbanItem {
  id: string;
  seekerId: string;
  seekerName?: string;
  seekerAvatar?: string;
  jobTitle?: string;
  atsScore?: number;
  subStage: string;
  appliedDate: Date;
}

export interface JobApplicationsKanbanResponseDto {
  [stage: string]: JobApplicationKanbanItem[];
}

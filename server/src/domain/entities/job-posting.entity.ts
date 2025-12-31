import { EmploymentType } from '../enums/employment-type.enum';
import { JobStatus } from '../enums/job-status.enum';
import { JobClosureType } from '../enums/job-closure-type.enum';
import { ATSStage, ATSSubStage } from '../enums/ats-stage.enum';
import { Salary } from '../interfaces/salary.interface';
import { STAGE_TO_SUB_STAGES } from '../utils/ats-pipeline.util';

export interface PopulatedCompany {
  id: string;
  companyName: string;
  logo: string;
}

/**
 * ATS Pipeline Configuration
 * Maps each enabled stage to its allowed sub-stages
 */
export interface ATSPipelineConfig {
  [stage: string]: ATSSubStage[];
}

export class JobPosting {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly responsibilities: string[],
    public readonly qualifications: string[],
    public readonly niceToHaves: string[],
    public readonly benefits: string[],
    public readonly salary: Salary,
    public readonly employmentTypes: EmploymentType[],
    public readonly location: string,
    public readonly skillsRequired: string[],
    public readonly categoryIds: string[],
    public readonly enabledStages: ATSStage[],
    public readonly atsPipelineConfig: ATSPipelineConfig,
    public readonly status: JobStatus,
    public readonly isFeatured: boolean,
    public readonly viewCount: number,
    public readonly applicationCount: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly totalVacancies?: number,
    public readonly filledVacancies?: number,
    public readonly closureType?: JobClosureType,
    public readonly closedAt?: Date,
    public readonly companyName?: string,
    public readonly companyLogo?: string,
    public readonly unpublishReason?: string,
  ) {}

  static create(data: {
    id: string;
    companyId: string;
    title: string;
    description: string;
    responsibilities: string[];
    qualifications: string[];
    niceToHaves?: string[];
    benefits?: string[];
    salary: Salary;
    employmentTypes: EmploymentType[];
    location: string;
    skillsRequired: string[];
    categoryIds: string[];
    enabledStages?: ATSStage[];
    atsPipelineConfig?: ATSPipelineConfig;
    status?: JobStatus;
    isFeatured?: boolean;
    viewCount?: number;
    applicationCount?: number;
    totalVacancies?: number;
    filledVacancies?: number;
    closureType?: JobClosureType;
    closedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    companyName?: string;
    companyLogo?: string;
    unpublishReason?: string;
  }): JobPosting {
    const now = new Date();
    const defaultEnabledStages = [
      ATSStage.IN_REVIEW,
      ATSStage.SHORTLISTED,
      ATSStage.INTERVIEW,
      ATSStage.TECHNICAL_TASK,
      ATSStage.COMPENSATION,
      ATSStage.OFFER,
    ];
    
    let enabledStages = (data.enabledStages && data.enabledStages.length > 0) ? data.enabledStages : defaultEnabledStages;
    
    // Ensure OFFER stage is always included
    if (!enabledStages.includes(ATSStage.OFFER)) {
      enabledStages = [...enabledStages, ATSStage.OFFER];
    }
    
    // Initialize pipeline config if not provided
    let pipelineConfig = data.atsPipelineConfig;
    if (!pipelineConfig) {
      pipelineConfig = {};
      enabledStages.forEach((stage) => {
        // Only add stage if it exists in STAGE_TO_SUB_STAGES (filter out invalid/old stages)
        if (STAGE_TO_SUB_STAGES[stage]) {
          pipelineConfig![stage] = [...STAGE_TO_SUB_STAGES[stage]];
        }
      });
    }
    
    return new JobPosting(
      data.id,
      data.companyId,
      data.title,
      data.description,
      data.responsibilities,
      data.qualifications,
      data.niceToHaves ?? [],
      data.benefits ?? [],
      data.salary,
      data.employmentTypes,
      data.location,
      data.skillsRequired,
      data.categoryIds,
      enabledStages,
      pipelineConfig,
      data.status ?? JobStatus.ACTIVE,
      data.isFeatured ?? false,
      data.viewCount ?? 0,
      data.applicationCount ?? 0,
      data.createdAt ?? now,
      data.updatedAt ?? now,
      data.totalVacancies ?? 1,
      data.filledVacancies ?? 0,
      data.closureType,
      data.closedAt,
      data.companyName,
      data.companyLogo,
      data.unpublishReason,
    );
  }
}
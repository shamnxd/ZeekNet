export type PlanChangeType = 'upgrade' | 'downgrade' | 'lateral' | 'new';

export interface JobToUnlistDetail {
    id: string;
    title: string;
    applicantCount: number;
    isFeatured: boolean;
    createdAt: string;
}

export interface PlanChangeImpact {
    changeType: PlanChangeType;
    jobsToUnlist: number;
    jobsToUnlistDetails: JobToUnlistDetail[];
    featuredJobsToUnlist: number;
    candidateViewsChange: number;
    jobPostLimitChange: number;
    featuredJobLimitChange: number;
    currentJobPostsUsed: number;
    currentFeaturedJobsUsed: number;
    newJobPostLimit: number;
    newFeaturedJobLimit: number;
    newCandidateViewLimit: number;
    estimatedProration?: number;
    billingCycleChange?: boolean;
}

export interface PreviewPlanChangeResponse {
    success: boolean;
    impact: PlanChangeImpact;
    currentPlan: {
        id: string;
        name: string;
        price: number;
        billingCycle: string;
    };
    newPlan: {
        id: string;
        name: string;
        price: number;
        billingCycle: string;
    };
    message?: string;
}

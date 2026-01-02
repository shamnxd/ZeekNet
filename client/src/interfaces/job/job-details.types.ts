
export interface Applicant {
    id: string;
    name: string;
    email?: string;
    stage: string;
    appliedDate: string;
    score?: number;
    avatar?: string;
    experience?: string;
    matchPercentage?: number;
}

export interface TrafficChannel {
    label: string;
    value: number;
    color: string;
}

export interface VisitorStat {
    country: string;
    count: number;
    flag: string;
}

export interface AnalyticsData {
    totalViews: number;
    totalViewsChange: number;
    totalApplied: number;
    totalAppliedChange: number;
    traffic: TrafficChannel[];
    visitors: VisitorStat[];
}

export type StageFilter = 'all' | 'applied' | 'shortlisted' | 'interview' | 'offered' | 'hired' | 'rejected';
export type ViewRange = '7d' | '14d' | '30d';

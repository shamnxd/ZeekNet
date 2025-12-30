import { ATSStage } from '@/constants/ats-stages';
import type { ATSJob } from '@/interfaces/ats/ats-job.interface';

export const mockATSJobs: ATSJob[] = [
  {
    jobId: 'job_1',
    jobTitle: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    employmentType: 'Full-time',
    enabledStages: [
      ATSStage.IN_REVIEW,
      ATSStage.SHORTLISTED,
      ATSStage.INTERVIEW,
      ATSStage.TECHNICAL_TASK,
      ATSStage.COMPENSATION,
      ATSStage.OFFER
    ],
    totalCandidates: 8,
    createdAt: '2025-12-01'
  },
  {
    jobId: 'job_2',
    jobTitle: 'Product Manager',
    department: 'Product',
    location: 'New York, NY',
    employmentType: 'Full-time',
    enabledStages: [
      ATSStage.IN_REVIEW,
      ATSStage.SHORTLISTED,
      ATSStage.INTERVIEW,
      ATSStage.COMPENSATION,
      ATSStage.OFFER
    ],
    totalCandidates: 5,
    createdAt: '2025-12-05'
  },
  {
    jobId: 'job_3',
    jobTitle: 'Backend Engineer',
    department: 'Engineering',
    location: 'Austin, TX',
    employmentType: 'Full-time',
    enabledStages: [
      ATSStage.IN_REVIEW,
      ATSStage.SHORTLISTED,
      ATSStage.INTERVIEW,
      ATSStage.TECHNICAL_TASK,
      ATSStage.OFFER
    ],
    totalCandidates: 6,
    createdAt: '2025-12-10'
  },
  {
    jobId: 'job_4',
    jobTitle: 'UX Designer',
    department: 'Design',
    location: 'Remote',
    employmentType: 'Full-time',
    enabledStages: [
      ATSStage.IN_REVIEW,
      ATSStage.INTERVIEW,
      ATSStage.TECHNICAL_TASK,
      ATSStage.OFFER
    ],
    totalCandidates: 4,
    createdAt: '2025-12-12'
  },
  {
    jobId: 'job_5',
    jobTitle: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Seattle, WA',
    employmentType: 'Full-time',
    enabledStages: [
      ATSStage.IN_REVIEW,
      ATSStage.SHORTLISTED,
      ATSStage.INTERVIEW,
      ATSStage.TECHNICAL_TASK,
      ATSStage.COMPENSATION,
      ATSStage.OFFER
    ],
    totalCandidates: 3,
    createdAt: '2025-12-15'
  }
];

export const getATSJobById = (jobId: string): ATSJob | undefined => {
  return mockATSJobs.find(job => job.jobId === jobId);
};

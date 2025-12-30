import type { ATSJob, ATSCandidate, ATSActivity, ATSInterview, ATSTechnicalTask, ATSOfferDocument, ATSComment } from '@/types/ats';
import { ATSStage, ActivityType } from '@/constants/ats-stages';

// Mock Jobs
export const mockATSJobs: ATSJob[] = [
  {
    jobId: 'job-001',
    jobTitle: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    employmentType: 'Full-time',
    enabledStages: [ATSStage.IN_REVIEW, ATSStage.SHORTLISTED, ATSStage.INTERVIEW, ATSStage.TECHNICAL_TASK, ATSStage.COMPENSATION, ATSStage.OFFER],
    totalCandidates: 24,
    createdAt: '2024-11-01',
  },
  {
    jobId: 'job-002',
    jobTitle: 'Product Designer',
    department: 'Design',
    location: 'Remote',
    employmentType: 'Full-time',
    enabledStages: [ATSStage.IN_REVIEW, ATSStage.SHORTLISTED, ATSStage.INTERVIEW, ATSStage.COMPENSATION, ATSStage.OFFER],
    totalCandidates: 18,
    createdAt: '2024-11-05',
  },
  {
    jobId: 'job-003',
    jobTitle: 'Backend Engineer',
    department: 'Engineering',
    location: 'New York, NY',
    employmentType: 'Full-time',
    enabledStages: [ATSStage.IN_REVIEW, ATSStage.SHORTLISTED, ATSStage.INTERVIEW, ATSStage.TECHNICAL_TASK, ATSStage.COMPENSATION, ATSStage.OFFER],
    totalCandidates: 31,
    createdAt: '2024-10-28',
  },
  {
    jobId: 'job-004',
    jobTitle: 'DevOps Engineer',
    department: 'Infrastructure',
    location: 'Austin, TX',
    employmentType: 'Full-time',
    enabledStages: [ATSStage.IN_REVIEW, ATSStage.SHORTLISTED, ATSStage.INTERVIEW, ATSStage.TECHNICAL_TASK, ATSStage.OFFER],
    totalCandidates: 12,
    createdAt: '2024-11-10',
  },
];

// Mock Candidates
export const mockATSCandidates: ATSCandidate[] = [
  // Senior Frontend Developer candidates
  {
    id: 'cand-001',
    name: 'Jessica Taylor',
    email: 'jessica.taylor@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    role: 'Senior Frontend Developer',
    jobId: 'job-001',
    stage: ATSStage.INTERVIEW,
    subStage: 'Scheduled',
    atsScore: 92,
    appliedDate: '2024-11-15',
    interviewDate: '2024-12-28',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    experience: '6 years',
    education: 'BS Computer Science, Stanford',
  },
  {
    id: 'cand-002',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+1 (555) 234-5678',
    location: 'Seattle, WA',
    role: 'Senior Frontend Developer',
    jobId: 'job-001',
    stage: ATSStage.TECHNICAL_TASK,
    subStage: 'Submitted',
    atsScore: 88,
    appliedDate: '2024-11-12',
    taskDeadline: '2024-12-30',
    skills: ['Vue.js', 'TypeScript', 'GraphQL', 'CSS'],
    experience: '5 years',
    education: 'MS Computer Science, MIT',
  },
  {
    id: 'cand-003',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 345-6789',
    location: 'Los Angeles, CA',
    role: 'Senior Frontend Developer',
    jobId: 'job-001',
    stage: ATSStage.IN_REVIEW,
    subStage: 'Resume Review',
    atsScore: 78,
    appliedDate: '2024-11-20',
    skills: ['React', 'JavaScript', 'Redux', 'Sass'],
    experience: '4 years',
    education: 'BS Software Engineering, UCLA',
  },
  {
    id: 'cand-004',
    name: 'David Williams',
    email: 'david.williams@email.com',
    location: 'Denver, CO',
    role: 'Senior Frontend Developer',
    jobId: 'job-001',
    stage: ATSStage.SHORTLISTED,
    subStage: 'Shortlisted for Interview',
    atsScore: 85,
    appliedDate: '2024-11-18',
    skills: ['Angular', 'TypeScript', 'RxJS', 'NgRx'],
    experience: '7 years',
    education: 'BS Computer Engineering, CU Boulder',
  },
  {
    id: 'cand-005',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '+1 (555) 456-7890',
    location: 'Portland, OR',
    role: 'Senior Frontend Developer',
    jobId: 'job-001',
    stage: ATSStage.COMPENSATION,
    subStage: 'Negotiation Ongoing',
    atsScore: 94,
    appliedDate: '2024-11-05',
    offerAmount: '$165,000',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
    experience: '8 years',
    education: 'MS Computer Science, Oregon State',
  },
  {
    id: 'cand-006',
    name: 'James Wilson',
    email: 'james.wilson@email.com',
    location: 'Chicago, IL',
    role: 'Senior Frontend Developer',
    jobId: 'job-001',
    stage: ATSStage.OFFER,
    subStage: 'Offer Sent',
    atsScore: 91,
    appliedDate: '2024-11-01',
    offerAmount: '$170,000',
    skills: ['React', 'TypeScript', 'GraphQL', 'Docker'],
    experience: '9 years',
    education: 'PhD Computer Science, UIUC',
  },
  {
    id: 'cand-007',
    name: 'Amanda Brown',
    email: 'amanda.brown@email.com',
    role: 'Senior Frontend Developer',
    jobId: 'job-001',
    stage: ATSStage.INTERVIEW,
    subStage: 'Completed',
    atsScore: 86,
    appliedDate: '2024-11-10',
    skills: ['React', 'Vue.js', 'JavaScript'],
    experience: '5 years',
    education: 'BS Computer Science, UC Berkeley',
  },
  {
    id: 'cand-008',
    name: 'Robert Martinez',
    email: 'robert.martinez@email.com',
    role: 'Senior Frontend Developer',
    jobId: 'job-001',
    stage: ATSStage.INTERVIEW,
    subStage: 'Evaluation Pending',
    atsScore: 83,
    appliedDate: '2024-11-08',
    skills: ['Angular', 'TypeScript', 'NGRX'],
    experience: '6 years',
    education: 'BS Software Engineering, ASU',
  },

  // Product Designer candidates
  {
    id: 'cand-009',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@email.com',
    phone: '+1 (555) 567-8901',
    location: 'New York, NY',
    role: 'Product Designer',
    jobId: 'job-002',
    stage: ATSStage.IN_REVIEW,
    subStage: 'Initial Screening',
    atsScore: 82,
    appliedDate: '2024-11-22',
    skills: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping'],
    experience: '4 years',
    education: 'BFA Graphic Design, Parsons',
  },
  {
    id: 'cand-010',
    name: 'Kevin Lee',
    email: 'kevin.lee@email.com',
    location: 'Boston, MA',
    role: 'Product Designer',
    jobId: 'job-002',
    stage: ATSStage.SHORTLISTED,
    subStage: 'Under Consideration',
    atsScore: 89,
    appliedDate: '2024-11-19',
    skills: ['Figma', 'User Research', 'Design Systems', 'Webflow'],
    experience: '6 years',
    education: 'MFA Design, RISD',
  },
  {
    id: 'cand-011',
    name: 'Rachel Green',
    email: 'rachel.green@email.com',
    role: 'Product Designer',
    jobId: 'job-002',
    stage: ATSStage.INTERVIEW,
    subStage: 'Scheduled',
    atsScore: 87,
    appliedDate: '2024-11-16',
    interviewDate: '2024-12-27',
    skills: ['Figma', 'Framer', 'Motion Design'],
    experience: '5 years',
    education: 'BS Industrial Design, Art Center',
  },

  // Backend Engineer candidates
  {
    id: 'cand-012',
    name: 'Christopher Hall',
    email: 'chris.hall@email.com',
    phone: '+1 (555) 678-9012',
    location: 'Austin, TX',
    role: 'Backend Engineer',
    jobId: 'job-003',
    stage: ATSStage.TECHNICAL_TASK,
    subStage: 'Under Review',
    atsScore: 90,
    appliedDate: '2024-11-14',
    taskDeadline: '2024-12-26',
    skills: ['Python', 'Django', 'PostgreSQL', 'Redis'],
    experience: '7 years',
    education: 'MS Computer Science, UT Austin',
  },
  {
    id: 'cand-013',
    name: 'Michelle Thomas',
    email: 'michelle.thomas@email.com',
    location: 'Miami, FL',
    role: 'Backend Engineer',
    jobId: 'job-003',
    stage: ATSStage.IN_REVIEW,
    subStage: 'Background Check',
    atsScore: 76,
    appliedDate: '2024-11-21',
    skills: ['Java', 'Spring Boot', 'MySQL', 'Kafka'],
    experience: '5 years',
    education: 'BS Computer Science, FIU',
  },
  {
    id: 'cand-014',
    name: 'Daniel Garcia',
    email: 'daniel.garcia@email.com',
    role: 'Backend Engineer',
    jobId: 'job-003',
    stage: ATSStage.OFFER,
    subStage: 'Offer Accepted',
    atsScore: 95,
    appliedDate: '2024-10-30',
    offerAmount: '$175,000',
    skills: ['Go', 'Kubernetes', 'gRPC', 'MongoDB'],
    experience: '8 years',
    education: 'PhD Computer Engineering, Georgia Tech',
  },

  // DevOps Engineer candidates
  {
    id: 'cand-015',
    name: 'Jennifer White',
    email: 'jennifer.white@email.com',
    phone: '+1 (555) 789-0123',
    location: 'Seattle, WA',
    role: 'DevOps Engineer',
    jobId: 'job-004',
    stage: ATSStage.INTERVIEW,
    subStage: 'Completed',
    atsScore: 88,
    appliedDate: '2024-11-17',
    skills: ['AWS', 'Terraform', 'Docker', 'CI/CD'],
    experience: '6 years',
    education: 'BS Systems Engineering, UW',
  },
  {
    id: 'cand-016',
    name: 'Andrew Clark',
    email: 'andrew.clark@email.com',
    location: 'Phoenix, AZ',
    role: 'DevOps Engineer',
    jobId: 'job-004',
    stage: ATSStage.SHORTLISTED,
    subStage: 'Shortlisted for Interview',
    atsScore: 84,
    appliedDate: '2024-11-19',
    skills: ['GCP', 'Kubernetes', 'Ansible', 'Python'],
    experience: '5 years',
    education: 'BS Information Technology, ASU',
  },
];

// Mock Activities
export const mockATSActivities: ATSActivity[] = [
  {
    id: 'act-001',
    candidateId: 'cand-001',
    type: ActivityType.STAGE_CHANGE,
    title: 'Moved to Interview stage',
    description: 'Candidate passed initial screening and moved to interview stage',
    timestamp: '2024-11-20T10:30:00Z',
    performedBy: 'Sarah Recruiter',
    stage: ATSStage.INTERVIEW,
    subStage: 'Scheduled',
  },
  {
    id: 'act-002',
    candidateId: 'cand-001',
    type: ActivityType.INTERVIEW_SCHEDULED,
    title: 'Technical Interview Scheduled',
    description: 'First round technical interview with the engineering team',
    timestamp: '2024-11-21T14:00:00Z',
    performedBy: 'John Hiring Manager',
    stage: ATSStage.INTERVIEW,
  },
  {
    id: 'act-003',
    candidateId: 'cand-002',
    type: ActivityType.TASK_ASSIGNED,
    title: 'Coding Challenge Assigned',
    description: 'React component development task with 3-day deadline',
    timestamp: '2024-11-22T09:00:00Z',
    performedBy: 'Mike Tech Lead',
    stage: ATSStage.TECHNICAL_TASK,
  },
  {
    id: 'act-004',
    candidateId: 'cand-002',
    type: ActivityType.TASK_SUBMITTED,
    title: 'Task Submitted',
    description: 'Candidate submitted the coding challenge for review',
    timestamp: '2024-11-25T16:00:00Z',
    performedBy: 'System',
    stage: ATSStage.TECHNICAL_TASK,
    subStage: 'Submitted',
  },
  {
    id: 'act-005',
    candidateId: 'cand-005',
    type: ActivityType.STAGE_CHANGE,
    title: 'Moved to Compensation',
    description: 'Successfully passed all interviews, proceeding to compensation discussion',
    timestamp: '2024-11-24T11:00:00Z',
    performedBy: 'HR Team',
    stage: ATSStage.COMPENSATION,
  },
  {
    id: 'act-006',
    candidateId: 'cand-006',
    type: ActivityType.OFFER_SENT,
    title: 'Offer Letter Sent',
    description: 'Official offer letter sent to candidate',
    timestamp: '2024-11-26T10:00:00Z',
    performedBy: 'HR Director',
    stage: ATSStage.OFFER,
    subStage: 'Offer Sent',
  },
  {
    id: 'act-007',
    candidateId: 'cand-014',
    type: ActivityType.OFFER_ACCEPTED,
    title: 'Offer Accepted',
    description: 'Candidate accepted the offer, starting date confirmed',
    timestamp: '2024-11-28T09:00:00Z',
    performedBy: 'System',
    stage: ATSStage.OFFER,
    subStage: 'Offer Accepted',
  },
];

// Mock Interviews
export const mockATSInterviews: ATSInterview[] = [
  {
    id: 'int-001',
    candidateId: 'cand-001',
    title: 'Technical Interview - Round 1',
    type: 'online',
    scheduledDate: '2024-12-28T14:00:00Z',
    status: 'scheduled',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    notes: 'Focus on React and system design concepts',
  },
  {
    id: 'int-002',
    candidateId: 'cand-007',
    title: 'Behavioral Interview',
    type: 'online',
    scheduledDate: '2024-12-20T10:00:00Z',
    status: 'completed',
    meetingLink: 'https://zoom.us/j/123456789',
    rating: 4,
    feedback: 'Excellent communication skills and cultural fit. Strong problem-solving mindset.',
  },
  {
    id: 'int-003',
    candidateId: 'cand-008',
    title: 'System Design Interview',
    type: 'offline',
    scheduledDate: '2024-12-22T15:00:00Z',
    status: 'completed',
    location: '123 Tech Street, Conference Room B',
    rating: 3,
    feedback: 'Good technical knowledge but needs improvement in scalability concepts.',
  },
  {
    id: 'int-004',
    candidateId: 'cand-011',
    title: 'Portfolio Review',
    type: 'online',
    scheduledDate: '2024-12-27T11:00:00Z',
    status: 'scheduled',
    meetingLink: 'https://meet.google.com/xyz-abcd-efg',
  },
  {
    id: 'int-005',
    candidateId: 'cand-015',
    title: 'Infrastructure Deep Dive',
    type: 'online',
    scheduledDate: '2024-12-18T13:00:00Z',
    status: 'completed',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/abc',
    rating: 5,
    feedback: 'Outstanding knowledge of cloud infrastructure and automation. Highly recommend.',
  },
];

// Mock Technical Tasks
export const mockATSTechnicalTasks: ATSTechnicalTask[] = [
  {
    id: 'task-001',
    candidateId: 'cand-002',
    title: 'React Dashboard Component',
    description: 'Build a responsive dashboard component with charts and data tables using React and TypeScript.',
    assignedDate: '2024-11-22T09:00:00Z',
    deadline: '2024-12-30T23:59:00Z',
    status: 'submitted',
    attachments: [
      { name: 'Requirements.pdf', url: '/docs/requirements.pdf' },
      { name: 'Figma_Design.fig', url: '/docs/design.fig' },
    ],
    submissions: [
      { name: 'dashboard-component.zip', url: '/submissions/dashboard.zip', submittedAt: '2024-11-25T16:00:00Z' },
    ],
    rating: 4,
    feedback: 'Good implementation with clean code structure. Minor improvements needed in error handling.',
  },
  {
    id: 'task-002',
    candidateId: 'cand-012',
    title: 'REST API Design',
    description: 'Design and implement a RESTful API for a todo application with authentication and CRUD operations.',
    assignedDate: '2024-11-18T10:00:00Z',
    deadline: '2024-12-26T23:59:00Z',
    status: 'under_review',
    attachments: [
      { name: 'API_Spec.md', url: '/docs/api-spec.md' },
    ],
    submissions: [
      { name: 'todo-api.zip', url: '/submissions/todo-api.zip', submittedAt: '2024-11-24T14:00:00Z' },
    ],
  },
];

// Mock Offer Documents
export const mockATSOfferDocuments: ATSOfferDocument[] = [
  {
    id: 'offer-001',
    candidateId: 'cand-006',
    name: 'Offer_Letter_James_Wilson.pdf',
    documentType: 'offer_letter',
    uploadedAt: '2024-11-26T10:00:00Z',
    uploadedBy: 'HR Director',
    url: '/offers/offer-letter-james.pdf',
    status: 'sent',
  },
  {
    id: 'offer-002',
    candidateId: 'cand-014',
    name: 'Employment_Contract_Daniel_Garcia.pdf',
    documentType: 'contract',
    uploadedAt: '2024-11-25T14:00:00Z',
    uploadedBy: 'Legal Team',
    url: '/offers/contract-daniel.pdf',
    status: 'signed',
  },
];

// Mock Comments
export const mockATSComments: ATSComment[] = [
  {
    id: 'comm-001',
    candidateId: 'cand-001',
    stage: ATSStage.INTERVIEW,
    subStage: 'Scheduled',
    comment: 'Very impressive portfolio. Strong experience with React ecosystem.',
    addedBy: 'John Hiring Manager',
    timestamp: '2024-11-21T15:00:00Z',
  },
  {
    id: 'comm-002',
    candidateId: 'cand-005',
    stage: ATSStage.COMPENSATION,
    subStage: 'Negotiation Ongoing',
    comment: 'Candidate requested 10% higher base salary. Discussing options with finance.',
    addedBy: 'HR Lead',
    timestamp: '2024-11-25T11:00:00Z',
  },
  {
    id: 'comm-003',
    candidateId: 'cand-002',
    stage: ATSStage.TECHNICAL_TASK,
    subStage: 'Submitted',
    comment: 'Code quality is excellent. Awaiting final review from tech lead.',
    addedBy: 'Senior Developer',
    timestamp: '2024-11-26T09:00:00Z',
  },
];

// Helper functions
export const getATSJobById = (jobId: string): ATSJob | undefined => 
  mockATSJobs.find(job => job.jobId === jobId);

export const getATSCandidateById = (candidateId: string): ATSCandidate | undefined => 
  mockATSCandidates.find(c => c.id === candidateId);

export const getATSCandidatesByJob = (jobId: string): ATSCandidate[] => 
  mockATSCandidates.filter(c => c.jobId === jobId);

export const getATSCandidatesByJobAndStage = (jobId: string, stage: ATSStage): ATSCandidate[] => 
  mockATSCandidates.filter(c => c.jobId === jobId && c.stage === stage);

export const getATSCandidatesByJobAndSubStage = (jobId: string, stage: ATSStage, subStage: string): ATSCandidate[] => 
  mockATSCandidates.filter(c => c.jobId === jobId && c.stage === stage && c.subStage === subStage);

export const getActivitiesByCandidate = (candidateId: string): ATSActivity[] => 
  mockATSActivities.filter(a => a.candidateId === candidateId);

export const getInterviewsByCandidate = (candidateId: string): ATSInterview[] => 
  mockATSInterviews.filter(i => i.candidateId === candidateId);

export const getTechnicalTasksByCandidate = (candidateId: string): ATSTechnicalTask[] => 
  mockATSTechnicalTasks.filter(t => t.candidateId === candidateId);

export const getOfferDocumentsByCandidate = (candidateId: string): ATSOfferDocument[] => 
  mockATSOfferDocuments.filter(o => o.candidateId === candidateId);

export const getCommentsByCandidate = (candidateId: string): ATSComment[] => 
  mockATSComments.filter(c => c.candidateId === candidateId);

export const getCandidateCountByJob = (jobId: string): number => 
  mockATSCandidates.filter(c => c.jobId === jobId).length;

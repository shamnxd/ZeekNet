import { ActivityType, type ATSActivity, type Interview, type TechnicalTask, type OfferDocument, type InternalComment } from '@/interfaces/ats/ats-activity.interface';

// Mock Activities
export const mockATSActivities: ATSActivity[] = [
  // Activities for candidate 1 (Sarah Johnson)
  {
    id: 'act_1',
    candidateId: 'cand_1',
    type: ActivityType.STAGE_CHANGE,
    title: 'Application Received',
    description: 'Candidate application moved to In Review stage',
    performedBy: 'System',
    timestamp: '2025-12-20T09:00:00',
    metadata: {
      toStage: 'In Review',
      toSubStage: 'Initial Screening'
    }
  },
  {
    id: 'act_2',
    candidateId: 'cand_1',
    type: ActivityType.COMMENT_ADDED,
    title: 'Initial Review Comment',
    description: 'Strong React and TypeScript experience. Good fit for the role.',
    performedBy: 'John Recruiter',
    performedByRole: 'Senior Recruiter',
    timestamp: '2025-12-20T14:30:00'
  },

  // Activities for candidate 3 (Jessica Taylor - Interview Scheduled)
  {
    id: 'act_3',
    candidateId: 'cand_3',
    type: ActivityType.STAGE_CHANGE,
    title: 'Moved to Interview Stage',
    description: 'Candidate progressed to Interview stage',
    performedBy: 'John Recruiter',
    performedByRole: 'Senior Recruiter',
    timestamp: '2025-12-18T10:00:00',
    metadata: {
      fromStage: 'Shortlisted',
      toStage: 'Interview',
      toSubStage: 'Scheduled'
    }
  },
  {
    id: 'act_4',
    candidateId: 'cand_3',
    type: ActivityType.INTERVIEW_SCHEDULED,
    title: 'Technical Interview Scheduled',
    description: 'Online technical interview scheduled with the engineering team',
    performedBy: 'John Recruiter',
    performedByRole: 'Senior Recruiter',
    timestamp: '2025-12-18T11:00:00',
    metadata: {
      interviewDate: '2025-12-24 10:00 AM',
      interviewType: 'online',
      meetingLink: 'https://meet.google.com/abc-defg-hij'
    }
  },
  {
    id: 'act_5',
    candidateId: 'cand_3',
    type: ActivityType.COMMENT_ADDED,
    title: 'Pre-Interview Note',
    description: 'Candidate has excellent portfolio. Focus on React architecture questions.',
    performedBy: 'Sarah Tech Lead',
    performedByRole: 'Engineering Manager',
    timestamp: '2025-12-19T15:00:00'
  },

  // Activities for candidate 5 (Emma Davis - Technical Task)
  {
    id: 'act_6',
    candidateId: 'cand_5',
    type: ActivityType.STAGE_CHANGE,
    title: 'Moved to Technical Task',
    description: 'Candidate advanced to Technical Task stage',
    performedBy: 'Sarah Tech Lead',
    timestamp: '2025-12-14T09:00:00',
    metadata: {
      fromStage: 'Interview',
      toStage: 'Technical Task',
      toSubStage: 'Assigned'
    }
  },
  {
    id: 'act_7',
    candidateId: 'cand_5',
    type: ActivityType.TASK_ASSIGNED,
    title: 'React Component Task Assigned',
    description: 'Build a responsive dashboard component with React and TypeScript',
    performedBy: 'Sarah Tech Lead',
    performedByRole: 'Engineering Manager',
    timestamp: '2025-12-14T10:00:00',
    metadata: {
      taskTitle: 'Dashboard Component',
      taskDescription: 'Create a reusable dashboard component',
      taskDeadline: '2025-12-23'
    }
  },
  {
    id: 'act_8',
    candidateId: 'cand_5',
    type: ActivityType.TASK_SUBMITTED,
    title: 'Task Submitted',
    description: 'Candidate submitted the technical task',
    performedBy: 'Emma Davis',
    timestamp: '2025-12-22T16:00:00',
    metadata: {
      documentName: 'dashboard-component.zip'
    }
  },
  {
    id: 'act_9',
    candidateId: 'cand_5',
    type: ActivityType.COMMENT_ADDED,
    title: 'Task Review Comment',
    description: 'Code quality is excellent. Clean architecture and good test coverage.',
    performedBy: 'Mike Developer',
    performedByRole: 'Senior Developer',
    timestamp: '2025-12-23T10:00:00'
  },

  // Activities for candidate 7 (Isabella White - Offer Sent)
  {
    id: 'act_10',
    candidateId: 'cand_7',
    type: ActivityType.STAGE_CHANGE,
    title: 'Moved to Offer Stage',
    description: 'Candidate progressed to final Offer stage',
    performedBy: 'John Recruiter',
    timestamp: '2025-12-08T09:00:00',
    metadata: {
      fromStage: 'Compensation',
      toStage: 'Offer',
      toSubStage: 'Offer Sent'
    }
  },
  {
    id: 'act_11',
    candidateId: 'cand_7',
    type: ActivityType.OFFER_SENT,
    title: 'Offer Letter Sent',
    description: 'Official offer letter sent to candidate',
    performedBy: 'John Recruiter',
    performedByRole: 'Senior Recruiter',
    timestamp: '2025-12-08T14:00:00',
    metadata: {
      documentName: 'offer_letter_isabella_white.pdf'
    }
  },
  {
    id: 'act_12',
    candidateId: 'cand_7',
    type: ActivityType.DOCUMENT_UPLOADED,
    title: 'Benefits Package Uploaded',
    description: 'Benefits and compensation details document uploaded',
    performedBy: 'HR Admin',
    performedByRole: 'HR Manager',
    timestamp: '2025-12-08T14:30:00',
    metadata: {
      documentName: 'benefits_package.pdf'
    }
  }
];

// Mock Interviews
export const mockInterviews: Interview[] = [
  // Candidate 3 interviews
  {
    id: 'int_1',
    candidateId: 'cand_3',
    title: 'Technical Interview - Frontend Development',
    scheduledDate: '2025-12-24T10:00:00',
    type: 'online',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    status: 'scheduled',
    notes: 'Focus on React architecture, state management, and component design patterns',
    createdAt: '2025-12-18T11:00:00'
  },
  {
    id: 'int_2',
    candidateId: 'cand_4',
    title: 'Technical Interview - System Design',
    scheduledDate: '2025-12-22T14:00:00',
    type: 'online',
    meetingLink: 'https://zoom.us/j/123456789',
    status: 'completed',
    notes: 'Discussed scalable architecture and microservices',
    rating: 4,
    feedback: 'Strong system design skills. Good understanding of distributed systems.',
    createdAt: '2025-12-15T09:00:00'
  },
  
  // Candidate 11 - Multiple interviews across different stages
  {
    id: 'int_11_1',
    candidateId: 'cand_11',
    title: 'Initial Phone Screening',
    scheduledDate: '2025-11-15T10:00:00',
    type: 'phone',
    status: 'completed',
    notes: 'Initial screening to assess basic qualifications and culture fit',
    rating: 5,
    feedback: 'Excellent communication skills. Strong background in full-stack development. Very enthusiastic about the role and company mission.',
    createdAt: '2025-11-14T09:00:00'
  },
  {
    id: 'int_11_2',
    candidateId: 'cand_11',
    title: 'Technical Interview - Frontend Focus',
    scheduledDate: '2025-11-20T14:00:00',
    type: 'online',
    meetingLink: 'https://meet.google.com/tech-interview-001',
    status: 'completed',
    notes: 'Deep dive into React, TypeScript, and modern frontend practices',
    rating: 5,
    feedback: 'Outstanding performance. Demonstrated deep understanding of React hooks, state management with Redux, and TypeScript best practices. Solved coding challenges efficiently with clean, well-documented code.',
    createdAt: '2025-11-18T10:00:00'
  },
  {
    id: 'int_11_3',
    candidateId: 'cand_11',
    title: 'System Design Interview',
    scheduledDate: '2025-11-25T15:00:00',
    type: 'online',
    meetingLink: 'https://zoom.us/j/system-design-789',
    status: 'completed',
    notes: 'Assess ability to design scalable systems and make architectural decisions',
    rating: 4,
    feedback: 'Solid system design skills. Proposed a well-thought-out microservices architecture with proper consideration for scalability, caching, and database design. Good understanding of trade-offs.',
    createdAt: '2025-11-23T09:00:00'
  },
  {
    id: 'int_11_4',
    candidateId: 'cand_11',
    title: 'Behavioral Interview with Team',
    scheduledDate: '2025-11-28T11:00:00',
    type: 'online',
    meetingLink: 'https://meet.google.com/behavioral-456',
    status: 'completed',
    notes: 'Evaluate teamwork, leadership, and cultural fit',
    rating: 5,
    feedback: 'Exceptional cultural fit. Shared great examples of collaboration, conflict resolution, and taking initiative. Team members were very impressed with their approach to problem-solving and mentoring.',
    createdAt: '2025-11-26T10:00:00'
  },
  {
    id: 'int_11_5',
    candidateId: 'cand_11',
    title: 'Final Interview with CTO',
    scheduledDate: '2025-12-02T16:00:00',
    type: 'in-person',
    location: 'ZeekNet HQ, Conference Room A',
    status: 'completed',
    notes: 'Final round with executive leadership to discuss vision and long-term goals',
    rating: 5,
    feedback: 'Impressive candidate. Strong technical skills combined with excellent communication and leadership potential. Aligned well with company vision. Highly recommend moving forward with offer.',
    createdAt: '2025-11-30T09:00:00'
  }
];

// Mock Technical Tasks
export const mockTechnicalTasks: TechnicalTask[] = [
  {
    id: 'task_1',
    candidateId: 'cand_5',
    title: 'Build a Responsive Dashboard Component',
    description: 'Create a reusable dashboard component using React and TypeScript. The component should be responsive, accessible, and include proper error handling.',
    assignedDate: '2025-12-14T10:00:00',
    deadline: '2025-12-23T23:59:59',
    status: 'submitted',
    attachments: [
      {
        id: 'att_1',
        name: 'task_requirements.pdf',
        url: '/documents/task_requirements.pdf',
        uploadedAt: '2025-12-14T10:00:00',
        uploadedBy: 'Sarah Tech Lead'
      },
      {
        id: 'att_2',
        name: 'design_mockup.fig',
        url: '/documents/design_mockup.fig',
        uploadedAt: '2025-12-14T10:05:00',
        uploadedBy: 'Sarah Tech Lead'
      }
    ],
    submissions: [
      {
        id: 'sub_1',
        submittedAt: '2025-12-22T16:00:00',
        files: [
          {
            id: 'file_1',
            name: 'dashboard-component.zip',
            url: '/submissions/dashboard-component.zip',
            uploadedAt: '2025-12-22T16:00:00',
            uploadedBy: 'Emma Davis'
          },
          {
            id: 'file_2',
            name: 'README.md',
            url: '/submissions/README.md',
            uploadedAt: '2025-12-22T16:00:00',
            uploadedBy: 'Emma Davis'
          }
        ],
        notes: 'Implemented all requirements with additional accessibility features and unit tests.'
      }
    ],
    feedback: 'Excellent work! Clean code, good test coverage, and thoughtful component design.',
    rating: 5
  },
  
  // Candidate 11 - Multiple technical tasks
  {
    id: 'task_11_1',
    candidateId: 'cand_11',
    title: 'E-Commerce Product Listing Page',
    description: 'Build a responsive product listing page with filtering, sorting, and pagination. Use React, TypeScript, and integrate with a mock API. Implement proper state management, error handling, and loading states.',
    assignedDate: '2025-12-03T09:00:00',
    deadline: '2025-12-10T23:59:59',
    status: 'reviewed',
    attachments: [
      {
        id: 'att_11_1',
        name: 'product_listing_requirements.pdf',
        url: '/documents/product_listing_requirements.pdf',
        uploadedAt: '2025-12-03T09:00:00',
        uploadedBy: 'Sarah Tech Lead'
      },
      {
        id: 'att_11_2',
        name: 'api_documentation.md',
        url: '/documents/api_documentation.md',
        uploadedAt: '2025-12-03T09:05:00',
        uploadedBy: 'Sarah Tech Lead'
      },
      {
        id: 'att_11_3',
        name: 'design_specs.fig',
        url: '/documents/design_specs.fig',
        uploadedAt: '2025-12-03T09:10:00',
        uploadedBy: 'UI Designer'
      }
    ],
    submissions: [
      {
        id: 'sub_11_1',
        submittedAt: '2025-12-09T18:30:00',
        files: [
          {
            id: 'file_11_1',
            name: 'product-listing-app.zip',
            url: '/submissions/product-listing-app.zip',
            uploadedAt: '2025-12-09T18:30:00',
            uploadedBy: 'Candidate 11'
          },
          {
            id: 'file_11_2',
            name: 'README.md',
            url: '/submissions/README_product_listing.md',
            uploadedAt: '2025-12-09T18:30:00',
            uploadedBy: 'Candidate 11'
          },
          {
            id: 'file_11_3',
            name: 'ARCHITECTURE.md',
            url: '/submissions/ARCHITECTURE.md',
            uploadedAt: '2025-12-09T18:30:00',
            uploadedBy: 'Candidate 11'
          }
        ],
        notes: 'Completed all requirements. Added bonus features: wishlist functionality, product comparison, and advanced filtering with URL state persistence. Included comprehensive unit and integration tests with 95% coverage.'
      }
    ],
    feedback: 'Outstanding work! Exceeded expectations with clean architecture, excellent code quality, and thoughtful UX improvements. The URL state management and test coverage are particularly impressive. This demonstrates senior-level skills.',
    rating: 5
  },
  {
    id: 'task_11_2',
    candidateId: 'cand_11',
    title: 'API Integration & Performance Optimization',
    description: 'Optimize the existing application\'s API calls and implement caching strategies. Reduce load times by at least 40% and implement proper error boundaries and retry logic.',
    assignedDate: '2025-12-12T10:00:00',
    deadline: '2025-12-18T23:59:59',
    status: 'completed',
    attachments: [
      {
        id: 'att_11_4',
        name: 'current_codebase.zip',
        url: '/documents/current_codebase.zip',
        uploadedAt: '2025-12-12T10:00:00',
        uploadedBy: 'Mike Developer'
      },
      {
        id: 'att_11_5',
        name: 'performance_benchmarks.pdf',
        url: '/documents/performance_benchmarks.pdf',
        uploadedAt: '2025-12-12T10:05:00',
        uploadedBy: 'Mike Developer'
      }
    ],
    submissions: [
      {
        id: 'sub_11_2',
        submittedAt: '2025-12-17T20:00:00',
        files: [
          {
            id: 'file_11_4',
            name: 'optimized-codebase.zip',
            url: '/submissions/optimized-codebase.zip',
            uploadedAt: '2025-12-17T20:00:00',
            uploadedBy: 'Candidate 11'
          },
          {
            id: 'file_11_5',
            name: 'performance-report.pdf',
            url: '/submissions/performance-report.pdf',
            uploadedAt: '2025-12-17T20:00:00',
            uploadedBy: 'Candidate 11'
          },
          {
            id: 'file_11_6',
            name: 'optimization-guide.md',
            url: '/submissions/optimization-guide.md',
            uploadedAt: '2025-12-17T20:00:00',
            uploadedBy: 'Candidate 11'
          }
        ],
        notes: 'Achieved 52% reduction in load times through React Query implementation, code splitting, and lazy loading. Added comprehensive error boundaries and implemented exponential backoff for API retries. Documented all changes and created a guide for the team.'
      }
    ],
    feedback: 'Exceptional performance optimization work. Exceeded the 40% target with a 52% improvement. The implementation of React Query and error handling patterns shows deep understanding of modern React best practices. The documentation will be valuable for the entire team.',
    rating: 5
  }
];

// Mock Offer Documents
export const mockOfferDocuments: OfferDocument[] = [
  {
    id: 'doc_1',
    candidateId: 'cand_7',
    documentType: 'offer_letter',
    name: 'Offer Letter - Isabella White.pdf',
    url: '/documents/offer_letter_isabella_white.pdf',
    uploadedAt: '2025-12-08T14:00:00',
    uploadedBy: 'John Recruiter',
    status: 'sent'
  },
  {
    id: 'doc_2',
    candidateId: 'cand_7',
    documentType: 'benefits',
    name: 'Benefits Package.pdf',
    url: '/documents/benefits_package.pdf',
    uploadedAt: '2025-12-08T14:30:00',
    uploadedBy: 'HR Admin',
    status: 'sent'
  },
  {
    id: 'doc_3',
    candidateId: 'cand_8',
    documentType: 'offer_letter',
    name: 'Offer Letter - Noah Johnson.pdf',
    url: '/documents/offer_letter_noah_johnson.pdf',
    uploadedAt: '2025-12-06T10:00:00',
    uploadedBy: 'John Recruiter',
    status: 'signed'
  },
  {
    id: 'doc_4',
    candidateId: 'cand_8',
    documentType: 'contract',
    name: 'Employment Contract - Noah Johnson.pdf',
    url: '/documents/contract_noah_johnson.pdf',
    uploadedAt: '2025-12-07T09:00:00',
    uploadedBy: 'HR Admin',
    status: 'signed'
  },
  
  // Candidate 11 - Complete offer package
  {
    id: 'doc_11_1',
    candidateId: 'cand_11',
    documentType: 'offer_letter',
    name: 'Offer Letter - Senior Full Stack Developer.pdf',
    url: '/documents/offer_letter_cand_11.pdf',
    uploadedAt: '2025-12-19T10:00:00',
    uploadedBy: 'John Recruiter',
    status: 'sent'
  },
  {
    id: 'doc_11_2',
    candidateId: 'cand_11',
    documentType: 'benefits',
    name: 'Comprehensive Benefits Package 2025.pdf',
    url: '/documents/benefits_package_2025.pdf',
    uploadedAt: '2025-12-19T10:15:00',
    uploadedBy: 'HR Manager',
    status: 'sent'
  },
  {
    id: 'doc_11_3',
    candidateId: 'cand_11',
    documentType: 'contract',
    name: 'Employment Agreement - Full Stack Developer.pdf',
    url: '/documents/employment_contract_cand_11.pdf',
    uploadedAt: '2025-12-19T10:30:00',
    uploadedBy: 'Legal Team',
    status: 'sent'
  },
  {
    id: 'doc_11_4',
    candidateId: 'cand_11',
    documentType: 'other',
    name: 'Stock Options Agreement.pdf',
    url: '/documents/stock_options_cand_11.pdf',
    uploadedAt: '2025-12-19T11:00:00',
    uploadedBy: 'Finance Team',
    status: 'sent'
  }
];

// Mock Internal Comments
export const mockInternalComments: InternalComment[] = [
  {
    id: 'comm_1',
    candidateId: 'cand_1',
    comment: 'Strong React and TypeScript experience. Good fit for the role.',
    addedBy: 'John Recruiter',
    addedByRole: 'Senior Recruiter',
    timestamp: '2025-12-20T14:30:00',
    stage: 'In Review',
    subStage: 'Initial Screening'
  },
  {
    id: 'comm_2',
    candidateId: 'cand_3',
    comment: 'Candidate has excellent portfolio. Focus on React architecture questions.',
    addedBy: 'Sarah Tech Lead',
    addedByRole: 'Engineering Manager',
    timestamp: '2025-12-19T15:00:00',
    stage: 'Interview',
    subStage: 'Scheduled'
  },
  {
    id: 'comm_3',
    candidateId: 'cand_5',
    comment: 'Code quality is excellent. Clean architecture and good test coverage.',
    addedBy: 'Mike Developer',
    addedByRole: 'Senior Developer',
    timestamp: '2025-12-23T10:00:00',
    stage: 'Technical Task',
    subStage: 'Submitted'
  },
  {
    id: 'comm_4',
    candidateId: 'cand_7',
    comment: 'Candidate negotiated well. Final offer approved at $155,000.',
    addedBy: 'HR Manager',
    addedByRole: 'HR Manager',
    timestamp: '2025-12-08T12:00:00',
    stage: 'Offer',
    subStage: 'Offer Sent'
  },
  
  // Candidate 11 - Detailed comments throughout the process
  {
    id: 'comm_11_1',
    candidateId: 'cand_11',
    comment: 'Initial application review: Impressive resume with 6+ years of full-stack experience. Strong portfolio showcasing React, Node.js, and cloud deployments. Moving to phone screening.',
    addedBy: 'John Recruiter',
    addedByRole: 'Senior Recruiter',
    timestamp: '2025-11-14T09:00:00',
    stage: 'In Review',
    subStage: 'Initial Screening'
  },
  {
    id: 'comm_11_2',
    candidateId: 'cand_11',
    comment: 'Phone screening went exceptionally well. Candidate is articulate, passionate about technology, and has a great cultural fit. Salary expectations align with our budget ($140K-160K). Scheduling technical interview.',
    addedBy: 'John Recruiter',
    addedByRole: 'Senior Recruiter',
    timestamp: '2025-11-15T11:00:00',
    stage: 'Interview',
    subStage: 'Phone Screen'
  },
  {
    id: 'comm_11_3',
    candidateId: 'cand_11',
    comment: 'Technical interview feedback: Outstanding performance! Solved all coding challenges with optimal solutions. Deep knowledge of React hooks, Redux, and TypeScript. Code was clean and well-documented. Strong recommend to proceed.',
    addedBy: 'Sarah Tech Lead',
    addedByRole: 'Engineering Manager',
    timestamp: '2025-11-20T16:00:00',
    stage: 'Interview',
    subStage: 'Technical Round'
  },
  {
    id: 'comm_11_4',
    candidateId: 'cand_11',
    comment: 'System design interview: Candidate proposed a solid microservices architecture with proper consideration for scalability, caching strategies, and database sharding. Good understanding of trade-offs between different approaches.',
    addedBy: 'John Architect',
    addedByRole: 'Principal Architect',
    timestamp: '2025-11-25T17:00:00',
    stage: 'Interview',
    subStage: 'System Design'
  },
  {
    id: 'comm_11_5',
    candidateId: 'cand_11',
    comment: 'Behavioral interview: Exceptional cultural fit! Shared great examples of mentoring junior developers, leading cross-functional projects, and handling difficult technical decisions. Team is very excited about this candidate.',
    addedBy: 'Emily Product Manager',
    addedByRole: 'Senior Product Manager',
    timestamp: '2025-11-28T13:00:00',
    stage: 'Interview',
    subStage: 'Behavioral'
  },
  {
    id: 'comm_11_6',
    candidateId: 'cand_11',
    comment: 'CTO interview completed. Alex was very impressed with the candidate\'s technical depth and leadership potential. Unanimous decision to move forward with technical assessment.',
    addedBy: 'John Recruiter',
    addedByRole: 'Senior Recruiter',
    timestamp: '2025-12-02T17:30:00',
    stage: 'Interview',
    subStage: 'Final Round'
  },
  {
    id: 'comm_11_7',
    candidateId: 'cand_11',
    comment: 'First technical task submitted early and exceeded all expectations. The product listing implementation included bonus features we didn\'t even ask for. 95% test coverage is outstanding. This is senior-level work.',
    addedBy: 'Mike Developer',
    addedByRole: 'Senior Developer',
    timestamp: '2025-12-10T09:00:00',
    stage: 'Technical Task',
    subStage: 'In Progress'
  },
  {
    id: 'comm_11_8',
    candidateId: 'cand_11',
    comment: 'Performance optimization task: Achieved 52% load time reduction (target was 40%). The React Query implementation and error handling patterns are production-ready. Documentation is thorough and will help the entire team.',
    addedBy: 'Sarah Tech Lead',
    addedByRole: 'Engineering Manager',
    timestamp: '2025-12-18T10:00:00',
    stage: 'Technical Task',
    subStage: 'Review'
  },
  {
    id: 'comm_11_9',
    candidateId: 'cand_11',
    comment: 'Compensation discussion completed. Candidate is looking for $155K base + equity. Given the exceptional performance throughout the process, I recommend we offer $158K base + standard equity package + signing bonus. This is a top-tier candidate.',
    addedBy: 'HR Manager',
    addedByRole: 'HR Manager',
    timestamp: '2025-12-19T09:00:00',
    stage: 'Compensation',
    subStage: 'Negotiation'
  },
  {
    id: 'comm_11_10',
    candidateId: 'cand_11',
    comment: 'Offer package sent: $158K base salary, 0.15% equity, $10K signing bonus, full benefits. Waiting for candidate response. Fingers crossed!',
    addedBy: 'John Recruiter',
    addedByRole: 'Senior Recruiter',
    timestamp: '2025-12-19T11:30:00',
    stage: 'Offer',
    subStage: 'Offer Sent'
  }
];

// Helper functions
export const getActivitiesByCandidate = (candidateId: string): ATSActivity[] => {
  return mockATSActivities
    .filter(activity => activity.candidateId === candidateId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const getInterviewsByCandidate = (candidateId: string): Interview[] => {
  return mockInterviews.filter(interview => interview.candidateId === candidateId);
};

export const getTechnicalTasksByCandidate = (candidateId: string): TechnicalTask[] => {
  return mockTechnicalTasks.filter(task => task.candidateId === candidateId);
};

export const getOfferDocumentsByCandidate = (candidateId: string): OfferDocument[] => {
  return mockOfferDocuments.filter(doc => doc.candidateId === candidateId);
};

export const getCommentsByCandidate = (candidateId: string): InternalComment[] => {
  return mockInternalComments
    .filter(comment => comment.candidateId === candidateId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

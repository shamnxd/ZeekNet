import { api } from '@/api/index';

export interface ScheduleInterviewRequest {
  applicationId: string;
  title: string;
  scheduledDate: string;
  type: 'online' | 'offline';
  videoType?: 'in-app' | 'external';
  webrtcRoomId?: string;
  meetingLink?: string;
  location?: string;
}

export interface UpdateInterviewRequest {
  status?: 'scheduled' | 'completed' | 'cancelled';
  rating?: number;
  feedback?: string;
}

export interface AssignTechnicalTaskRequest {
  applicationId: string;
  title: string;
  description: string;
  deadline: string;
  documentUrl?: string;
  documentFilename?: string;
}

export interface UpdateTechnicalTaskRequest {
  title?: string;
  description?: string;
  deadline?: string;
  documentUrl?: string;
  documentFilename?: string;
  submissionUrl?: string;
  submissionFilename?: string;
  status?: 'assigned' | 'submitted' | 'under_review' | 'completed';
  rating?: number;
  feedback?: string;
}

export interface UploadOfferRequest {
  applicationId: string;
  documentUrl?: string;
  documentFilename?: string;
  document?: File;
  offerAmount?: string;
}

export interface UpdateOfferStatusRequest {
  status: 'draft' | 'sent' | 'signed' | 'declined';
  withdrawalReason?: string;
}

export interface AddCommentRequest {
  applicationId: string;
  comment: string;
  stage: string;
  subStage?: string;
}

export interface UpdateApplicationStageRequest {
  stage: string;
  subStage?: string;
  rejectionReason?: string;
}

class ATSService {

  async scheduleInterview(data: ScheduleInterviewRequest) {
    const response = await api.post('/api/company/applications/interviews', data);
    return response.data;
  }

  async updateInterview(id: string, data: UpdateInterviewRequest) {
    const response = await api.put(`/api/company/applications/interviews/${id}`, data);
    return response.data;
  }

  async getInterviewsByApplication(applicationId: string) {
    const response = await api.get(`/api/company/applications/${applicationId}/interviews`);
    return response.data;
  }


  async assignTechnicalTask(data: AssignTechnicalTaskRequest & { document?: File }) {
    const formData = new FormData();
    formData.append('applicationId', data.applicationId);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('deadline', data.deadline);

    if (data.document) {
      formData.append('document', data.document);
    } else if (data.documentUrl && data.documentFilename) {
      formData.append('documentUrl', data.documentUrl);
      formData.append('documentFilename', data.documentFilename);
    }

    const response = await api.post('/api/company/applications/tasks', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async updateTechnicalTask(id: string, data: {
    title?: string;
    description?: string;
    deadline?: string;
    document?: File;
    documentUrl?: string;
    documentFilename?: string;
    status?: string;
    rating?: number;
    feedback?: string
  }) {
    const formData = new FormData();

    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.deadline) formData.append('deadline', data.deadline);
    if (data.status) formData.append('status', data.status);
    if (data.rating !== undefined) formData.append('rating', data.rating.toString());
    if (data.feedback) formData.append('feedback', data.feedback);

    if (data.document) {
      formData.append('document', data.document);
    } else if (data.documentUrl && data.documentFilename) {
      formData.append('documentUrl', data.documentUrl);
      formData.append('documentFilename', data.documentFilename);
    }

    const response = await api.put(`/api/company/applications/tasks/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async deleteTechnicalTask(taskId: string) {
    const response = await api.delete(`/api/company/applications/tasks/${taskId}`);
    return response.data;
  }

  async getTechnicalTasksByApplication(applicationId: string) {
    const response = await api.get(`/api/company/applications/${applicationId}/tasks`);
    return response.data;
  }


  async uploadOffer(data: UploadOfferRequest) {
    const formData = new FormData();
    formData.append('applicationId', data.applicationId);
    if (data.offerAmount) {
      formData.append('offerAmount', data.offerAmount);
    }
    if (data.document) {
      formData.append('document', data.document);
    } else if (data.documentUrl && data.documentFilename) {
      formData.append('documentUrl', data.documentUrl);
      formData.append('documentFilename', data.documentFilename);
    }
    const response = await api.post('/api/company/applications/offers', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async updateOfferStatus(id: string, data: UpdateOfferStatusRequest) {
    const response = await api.put(`/api/company/applications/offers/${id}/status`, data);
    return response.data;
  }

  async getOffersByApplication(applicationId: string) {
    const response = await api.get(`/api/company/applications/${applicationId}/offers`);
    return response.data;
  }

  async getOffersByApplicationForSeeker(applicationId: string) {
    const response = await api.get(`/api/seeker/applications/${applicationId}/offers`);
    return response.data?.data || response.data;
  }

  async acceptOffer(applicationId: string, offerId: string) {
    const response = await api.put(`/api/seeker/applications/${applicationId}/offers/${offerId}/status`, {
      status: 'signed'
    });
    return response.data;
  }

  async declineOffer(applicationId: string, offerId: string) {
    const response = await api.put(`/api/seeker/applications/${applicationId}/offers/${offerId}/status`, {
      status: 'declined'
    });
    return response.data;
  }

  async uploadSignedOfferDocument(applicationId: string, offerId: string, document: File) {
    const formData = new FormData();
    formData.append('document', document);

    const response = await api.post(`/api/seeker/applications/${applicationId}/offers/${offerId}/signed-document`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async getCompensationForSeeker(applicationId: string) {
    const response = await api.get(`/api/seeker/applications/${applicationId}/compensation`);
    return response.data?.data || response.data;
  }

  async getCompensationMeetingsForSeeker(applicationId: string) {
    const response = await api.get(`/api/seeker/applications/${applicationId}/compensation/meetings`);
    return response.data?.data || response.data || [];
  }


  async addComment(data: AddCommentRequest) {
    const response = await api.post('/api/company/applications/comments', data);
    return response.data;
  }

  async getCommentsByApplication(applicationId: string) {
    const response = await api.get(`/api/company/applications/${applicationId}/comments`);
    return response.data;
  }





  async updateApplicationStage(applicationId: string, data: UpdateApplicationStageRequest) {
    const payload = {
      ...data,
      sub_stage: data.subStage
    };
    const response = await api.patch(`/api/company/applications/${applicationId}/stage`, payload);
    return response.data;
  }


  async getInterviewsByApplicationForSeeker(applicationId: string) {
    const response = await api.get(`/api/seeker/applications/${applicationId}/interviews`);
    return response.data;
  }

  async getTechnicalTasksByApplicationForSeeker(applicationId: string) {
    const response = await api.get(`/api/seeker/applications/${applicationId}/tasks`);
    return response.data;
  }

  async submitTechnicalTask(applicationId: string, taskId: string, data: { document?: File; submissionLink?: string; submissionNote?: string; submissionUrl?: string; submissionFilename?: string }) {
    const formData = new FormData();

    if (data.document) {
      formData.append('document', data.document);
    }
    if (data.submissionLink) {
      formData.append('submissionLink', data.submissionLink);
    }
    if (data.submissionNote) {
      formData.append('submissionNote', data.submissionNote);
    }

    if (data.submissionUrl && !data.document) {
      formData.append('submissionUrl', data.submissionUrl);
    }
    if (data.submissionFilename && !data.document) {
      formData.append('submissionFilename', data.submissionFilename);
    }

    const response = await api.put(`/api/seeker/applications/${applicationId}/tasks/${taskId}/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }


  async initiateCompensation(applicationId: string, data: { candidateExpected: string; notes?: string }) {
    const response = await api.post(`/api/company/applications/${applicationId}/compensation/initiate`, data);
    return response.data;
  }

  async updateCompensation(applicationId: string, data: {
    candidateExpected?: string;
    companyProposed?: string;
    expectedJoining?: string;
    benefits?: string[];
    finalAgreed?: string;
    approvedAt?: string;
    approvedBy?: string;
    approvedByName?: string;
    notes?: string
  }) {
    const response = await api.put(`/api/company/applications/${applicationId}/compensation`, data);
    return response.data;
  }

  async getCompensation(applicationId: string) {
    const response = await api.get(`/api/company/applications/${applicationId}/compensation`);

    return response.data?.data || response.data || null;
  }

  async scheduleCompensationMeeting(applicationId: string, data: { type: string; videoType?: 'in-app' | 'external'; date: string; time: string; location?: string; meetingLink?: string; notes?: string }) {
    const response = await api.post(`/api/company/applications/${applicationId}/compensation/meetings`, data);

    return response.data?.data || response.data;
  }

  async getCompensationMeetings(applicationId: string) {
    const response = await api.get(`/api/company/applications/${applicationId}/compensation/meetings`);

    return response.data?.data || response.data || [];
  }

  async updateCompensationMeetingStatus(applicationId: string, meetingId: string, status: 'scheduled' | 'completed' | 'cancelled') {
    const response = await api.put(`/api/company/applications/${applicationId}/compensation/meetings/${meetingId}/status`, { status });
    return response.data?.data || response.data;
  }

}

export const atsService = new ATSService();

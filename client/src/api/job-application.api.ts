import { api } from './index'

export const jobApplicationApi = {

  async createApplication(formData: FormData) {
    return api.post('/api/seeker/applications', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  async analyzeResume(formData: FormData) {
    return api.post('/api/seeker/applications/analyze-resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  async getSeekerApplications(params?: {
    stage?: 'applied' | 'shortlisted' | 'interview' | 'rejected' | 'hired'
    page?: number
    limit?: number
  }) {
    return api.get('/api/seeker/applications', { params })
  },

  async getSeekerApplicationById(id: string) {
    return api.get(`/api/seeker/applications/${id}`)
  },


  async getCompanyApplications(params?: {
    job_id?: string
    stage?: 'applied' | 'shortlisted' | 'interview' | 'rejected' | 'hired'
    search?: string
    page?: number
    limit?: number
  }) {
    return api.get('/api/company/applications', { params })
  },

  async getCompanyApplicationById(id: string) {
    return api.get(`/api/company/applications/${id}`)
  },

  async updateApplicationStage(id: string, body: { stage: 'applied' | 'shortlisted' | 'interview' | 'rejected' | 'hired'; rejection_reason?: string }) {
    return api.patch(`/api/company/applications/${id}/stage`, body)
  },

  async updateApplicationScore(id: string, body: { score: number }) {
    return api.patch(`/api/company/applications/${id}/score`, body)
  },

  async addInterview(id: string, body: { date: string | Date; time: string; interview_type: string; location: string; interviewer_name?: string }) {
    return api.post(`/api/company/applications/${id}/interviews`, body)
  },

  async updateInterview(id: string, interviewId: string, body: Partial<{ date: string | Date; time: string; interview_type: string; location: string; interviewer_name?: string; status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' }>) {
    return api.patch(`/api/company/applications/${id}/interviews/${interviewId}`, body)
  },

  async deleteInterview(id: string, interviewId: string) {
    return api.delete(`/api/company/applications/${id}/interviews/${interviewId}`)
  },

  async addInterviewFeedback(id: string, interviewId: string, body: { reviewer_name: string; rating?: number; comment: string }) {
    return api.post(`/api/company/applications/${id}/interviews/${interviewId}/feedback`, body)
  },
}



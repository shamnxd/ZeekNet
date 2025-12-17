import { api } from './index'
import { ApplicationStage } from '@/constants/enums'
import { CompanyRoutes, SeekerRoutes } from '@/constants/api-routes'

export const jobApplicationApi = {

  async createApplication(formData: FormData) {
    return api.post(SeekerRoutes.APPLICATIONS, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  async analyzeResume(formData: FormData) {
    return api.post(SeekerRoutes.APPLICATIONS_ANALYZE_RESUME, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  async getSeekerApplications(params?: {
    stage?: ApplicationStage
    page?: number
    limit?: number
  }) {
    return api.get(SeekerRoutes.APPLICATIONS, { params })
  },

  async getSeekerApplicationById(id: string) {
    return api.get(SeekerRoutes.APPLICATIONS_ID.replace(':id', id))
  },


  async getCompanyApplications(params?: {
    job_id?: string
    stage?: ApplicationStage
    search?: string
    page?: number
    limit?: number
  }) {
    return api.get(CompanyRoutes.APPLICATIONS, { params })
  },

  async getCompanyApplicationById(id: string) {
    return api.get(CompanyRoutes.APPLICATIONS_ID.replace(':id', id))
  },

  async updateApplicationStage(id: string, body: { stage: ApplicationStage; rejection_reason?: string }) {
    return api.patch(CompanyRoutes.APPLICATIONS_ID_STAGE.replace(':id', id), body)
  },

  async bulkUpdateApplicationStage(body: { 
    application_ids: string[], 
    stage: ApplicationStage 
  }) {
    return api.post(CompanyRoutes.APPLICATIONS_BULK_UPDATE, body)
  },

  async updateApplicationScore(id: string, body: { score: number }) {
    return api.patch(CompanyRoutes.APPLICATIONS_ID_SCORE.replace(':id', id), body)
  },

  async addInterview(id: string, body: { date: string | Date; time: string; interview_type: string; location: string; interviewer_name?: string }) {
    return api.post(CompanyRoutes.APPLICATIONS_ID_INTERVIEWS.replace(':id', id), body)
  },

  async updateInterview(id: string, interviewId: string, body: Partial<{ date: string | Date; time: string; interview_type: string; location: string; interviewer_name?: string; status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' }>) {
    return api.patch(CompanyRoutes.APPLICATIONS_ID_INTERVIEWS_INTERVIEW_ID.replace(':id', id).replace(':interviewId', interviewId), body)
  },

  async deleteInterview(id: string, interviewId: string) {
    return api.delete(CompanyRoutes.APPLICATIONS_ID_INTERVIEWS_INTERVIEW_ID.replace(':id', id).replace(':interviewId', interviewId))
  },

  async addInterviewFeedback(id: string, interviewId: string, body: { reviewer_name: string; rating?: number; comment: string }) {
    return api.post(CompanyRoutes.APPLICATIONS_ID_INTERVIEWS_FEEDBACK.replace(':id', id).replace(':interviewId', interviewId), body)
  },
}



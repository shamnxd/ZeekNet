import { api } from './index'
import { CompanyRoutes, SeekerRoutes } from '@/constants/api-routes'
import type {
  GetSeekerApplicationsParams,
  GetCompanyApplicationsParams,
  UpdateApplicationStageRequest,
  BulkUpdateApplicationStageRequest,
  UpdateApplicationScoreRequest,
  AddInterviewRequest,
  UpdateInterviewRequest,
  AddInterviewFeedbackRequest
} from '@/interfaces/job-application/job-application.interface';

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

  async getSeekerApplications(params?: GetSeekerApplicationsParams) {
    return api.get(SeekerRoutes.APPLICATIONS, { params })
  },

  async getSeekerApplicationById(id: string) {
    return api.get(SeekerRoutes.APPLICATIONS_ID.replace(':id', id))
  },


  async getCompanyApplications(params?: GetCompanyApplicationsParams) {
    return api.get(CompanyRoutes.APPLICATIONS, { params })
  },

  async getCompanyApplicationById(id: string) {
    return api.get(CompanyRoutes.APPLICATIONS_ID.replace(':id', id))
  },

  async updateApplicationStage(id: string, body: UpdateApplicationStageRequest) {
    return api.patch(CompanyRoutes.APPLICATIONS_ID_STAGE.replace(':id', id), body)
  },

  async bulkUpdateApplicationStage(body: BulkUpdateApplicationStageRequest) {
    return api.post(CompanyRoutes.APPLICATIONS_BULK_UPDATE, body)
  },

  async updateApplicationScore(id: string, body: UpdateApplicationScoreRequest) {
    return api.patch(CompanyRoutes.APPLICATIONS_ID_SCORE.replace(':id', id), body)
  },

  async addInterview(id: string, body: AddInterviewRequest) {
    return api.post(CompanyRoutes.APPLICATIONS_ID_INTERVIEWS.replace(':id', id), body)
  },

  async updateInterview(id: string, interviewId: string, body: UpdateInterviewRequest) {
    return api.patch(CompanyRoutes.APPLICATIONS_ID_INTERVIEWS_INTERVIEW_ID.replace(':id', id).replace(':interviewId', interviewId), body)
  },

  async deleteInterview(id: string, interviewId: string) {
    return api.delete(CompanyRoutes.APPLICATIONS_ID_INTERVIEWS_INTERVIEW_ID.replace(':id', id).replace(':interviewId', interviewId))
  },

  async addInterviewFeedback(id: string, interviewId: string, body: AddInterviewFeedbackRequest) {
    return api.post(CompanyRoutes.APPLICATIONS_ID_INTERVIEWS_FEEDBACK.replace(':id', id).replace(':interviewId', interviewId), body)
  },
}



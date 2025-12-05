import { api } from './index';
import type { LoginPayload, RegisterPayload, GoogleLoginPayload, ApiEnvelope, AuthResponseData } from '@/interfaces/auth';

export const authApi = {
  async login(payload: LoginPayload): Promise<ApiEnvelope<AuthResponseData>> {
    return (await api.post<ApiEnvelope<AuthResponseData>>('/api/auth/login', payload)).data;
  },

  async adminLogin(payload: LoginPayload): Promise<ApiEnvelope<AuthResponseData>> {
    return (await api.post<ApiEnvelope<AuthResponseData>>('/api/auth/admin-login', payload)).data;
  },

  async register(payload: RegisterPayload): Promise<ApiEnvelope<AuthResponseData>> {
    return (await api.post<ApiEnvelope<AuthResponseData>>('/api/auth/register', payload)).data;
  },

  async forgotPassword(email: string): Promise<ApiEnvelope<AuthResponseData>> {
    return (await api.post<ApiEnvelope<AuthResponseData>>('/api/auth/forgot-password', { email })).data;
  },

  async resetPassword(token: string, newPassword: string): Promise<ApiEnvelope<void>> {
    return (await api.post<ApiEnvelope<void>>('/api/auth/reset-password', {
      token: token,
      newPassword: newPassword
    })).data;
  },

  async requestOtp(email: string): Promise<ApiEnvelope<void>> {
    return (await api.post<ApiEnvelope<void>>('/api/auth/otp-request', { email })).data;
  },

  async verifyOtp(email: string, code: string): Promise<ApiEnvelope<AuthResponseData>> {
    return (await api.post<ApiEnvelope<AuthResponseData>>('/api/auth/otp-verify', { email, code })).data;
  },

  async googleLogin(payload: GoogleLoginPayload): Promise<ApiEnvelope<AuthResponseData>> {
    return (await api.post<ApiEnvelope<AuthResponseData>>('/api/auth/login/google', payload)).data;
  },

  async refreshToken(): Promise<ApiEnvelope<AuthResponseData>> {
    return (await api.post<ApiEnvelope<AuthResponseData>>('/api/auth/refresh', {})).data;
  },

  async getCurrentUser(): Promise<ApiEnvelope<AuthResponseData>> {
    return (await api.get<ApiEnvelope<AuthResponseData>>('/api/auth/check-auth')).data;
  },

  async logout(): Promise<ApiEnvelope<void>> {
    return (await api.post<ApiEnvelope<void>>('/api/auth/logout', {})).data;
  }
}
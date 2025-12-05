import { api } from '../../api/index';
import type { ApiEnvelope } from '@/interfaces/auth';

export const uploadFile = async <T>(
  endpoint: string,
  file: File,
  fieldName: string = 'file',
  additionalData: Record<string, unknown> = {}
): Promise<ApiEnvelope<T>> => {
  const formData = new FormData();
  formData.append(fieldName, file);

  Object.entries(additionalData).forEach(([key, value]) => {
    if (value) {
      formData.append(key, value as string);
    }
  });

  const res = await api.post<ApiEnvelope<T>>(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};


import { z } from 'zod';
import { commonValidations } from '../../../shared/validation/common';

export const LoginDto = z.object({
  email: commonValidations.email,
  password: commonValidations.password,
});
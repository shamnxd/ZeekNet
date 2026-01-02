import { z } from 'zod';

export const HandleStripeWebhookDto = z.object({
  payload: z.union([z.string(), z.instanceof(Buffer)]),
  signature: z.string().min(1, 'Signature is required'),
});

export type HandleStripeWebhookRequestDto = z.infer<typeof HandleStripeWebhookDto>;

import z from "zod";

export const RequestOtpDto = z.object({
    email: z.string().email('Invalid email address'),
});
export type RequestOtpRequestDto = z.infer<typeof RequestOtpDto>; 
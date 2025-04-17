import z from 'zod';

export const registerSchema = z.object({
  id: z.string(),
  email: z.string().email()
})

export const verifySchema = z.object({
  token: z.string()
});

import { z } from 'zod';

export const env = z.object({
  MONGO_URI: z.string(),
  JWT_SECRET: z.string(),
});

export const envSchema = env.parse(process.env);

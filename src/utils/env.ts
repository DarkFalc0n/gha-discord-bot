import { z } from "zod";

export const env = z.object({
  PORT: z.coerce.number().default(8000),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  DISCORD_TOKEN: z.string({
    required_error: "A valid Discord Token is required",
  }),
});

export type Env = z.infer<typeof env>;

export const config = env.parse(process.env);

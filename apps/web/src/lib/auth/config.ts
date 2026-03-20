import { z } from "zod";

export const SESSION_COOKIE_NAME = "ar_session";
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

export const MAGIC_LINK_TOKEN_EXPIRY_MINUTES = 15;

export const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type AuthInput = z.infer<typeof authSchema>;

import { z } from "zod";
import { isValidId } from "../../../utils/helpers";

export const searchSchema = z.object({
  search_query: z.string(),
});

export const inviteSchema = z.object({
  role: z.string(),
  email: z.string(),
});

export const acceptInviteSchema = z.object({
  code: z.string(),
  userName: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export const getInviteSchema = z.object({
  id: z
    .string()
    .refine((val) => isValidId(val))
    .optional(),
});

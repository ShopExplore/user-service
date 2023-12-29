import { z } from "zod";
import { isValidId } from "../../../utils/helpers";
import platformConstants from "../../../configs/platfromContants";

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

export const requestResponseSchema = z.object({
  userId: z.string().refine((val) => isValidId(val)),
  response: z
    .string()
    .refine((value: (typeof platformConstants.requestStatus)[number]) =>
      ["granted", "declined"].includes(value)
    ),
});

export const getRequestSchema = z.object({
  requestId: z
    .string()
    .refine((val) => isValidId(val))
    .optional(),
});

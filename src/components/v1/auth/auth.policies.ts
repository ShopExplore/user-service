import z from "zod";
import platformConstants from "../../../configs/platfromContants";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const signUpSchema = z.object({
  userName: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export const verifyOtpSchema = z.object({
  code: z.string().refine((value) => value.length === 6),
  email: z.string().email(),
  otpPurpose: z
    .string()
    .refine(
      (value: (typeof platformConstants.otpPurpose)[number]) =>
        platformConstants.otpPurpose.includes(value),
      {
        message: "invalid otp purpose",
      }
    ),
});

export const resendOtpSchema = z.object({
  email: z.string().email(),
  otpPurpose: z
    .string()
    .refine(
      (value: (typeof platformConstants.otpPurpose)[number]) =>
        platformConstants.otpPurpose.includes(value),
      {
        message: "invalid otp purpose",
      }
    ),
});

export const forgotPasswrdSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z
  .object({
    password: z.string(),
    confirmPassword: z.string(),
    email: z.string().email(),
    code: z.string().refine((value) => value.length === 6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: z.string(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"],
  });

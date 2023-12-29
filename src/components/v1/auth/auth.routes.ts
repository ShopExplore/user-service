import { Router } from "express";

import doSignup from "./authActions/doSignUp";
import doLogin from "./authActions/doLogin";
import {
  verifyOtpSchema,
  loginSchema,
  signUpSchema,
  resendOtpSchema,
  forgotPasswrdSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "./auth.policies";
import policyMiddleware from "../../../appMiddlewares/policy.middlewares";
import verifyOtp from "./authActions/verifyOTP";
import resendOtp from "./authActions/resendOTP";
import forgotPassword from "./authActions/forgotPassword";
import resetPassword from "./authActions/resetPassword";
import { validateTokenMiddleware } from "./authMiddlewares";
import requireAuth from "./authMiddlewares/requireAuth";
import changePassword from "./authActions/changePassword";

const router = Router();

router.post("/signup", policyMiddleware(signUpSchema), doSignup);
router.post("/verify-otp", policyMiddleware(verifyOtpSchema), verifyOtp);
router.post("/resend-otp", policyMiddleware(resendOtpSchema), resendOtp);
router.post("/login", policyMiddleware(loginSchema), doLogin);
router.post(
  "/forgot-password",
  policyMiddleware(forgotPasswrdSchema),
  forgotPassword
);
router.patch(
  "/reset-password",
  policyMiddleware(resetPasswordSchema),
  resetPassword
);
router.patch(
  "/change-password",
  policyMiddleware(changePasswordSchema),
  validateTokenMiddleware,
  requireAuth,
  changePassword
);

const authRouter = router;
export default authRouter;

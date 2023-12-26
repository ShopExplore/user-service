import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { randomBytes } from "node:crypto";

import { IAuth, IOtp } from "./auth.types";
import appConfig from "../../../configs";
import { IToken } from "../../../utils/types";
import jwt from "jsonwebtoken";
import platformConstants from "../../../configs/platfromContants";

const { authConfigs, hashPepper } = appConfig;

const authSchema = new Schema<IAuth>(
  {
    User: { type: Schema.Types.ObjectId, ref: "User" },
    password: {
      type: String,
      required: true,
    },
    lastLoginAt: Date,
    failedLoginAttempts: { type: Number, default: 0 },
    isVerified: Boolean,
  },
  { timestamps: true }
);

authSchema.pre<IAuth>("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(authConfigs.saltRounds);

      const hashedPassword = await bcrypt.hash(
        this.password + hashPepper,
        salt
      );
      this.password = hashedPassword;
    }

    next();
  } catch (err) {
    return next(err);
  }
});

authSchema.methods.comparePassword = function (password: string): boolean {
  return bcrypt.compareSync(password + hashPepper, this.password);
};

authSchema.methods.generateToken = ({
  data,
  expiresIn = authConfigs.sessionLifespan,
  audience = "web",
}: {
  data: IToken;
  expiresIn?: number;
  audience?: "web" | "app";
}): string =>
  jwt.sign(data, authConfigs.jwtSecret, {
    expiresIn,
    issuer: `shopExplore-${appConfig.environment}`,
    audience: `${audience}-user`,
  });

authSchema.methods.randomOTP = (): string => randomBytes(3).toString("hex");

const AuthModel = model<IAuth>("Auth", authSchema);
export default AuthModel;

const otpSchema = new Schema<IOtp>(
  {
    User: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    code: {
      type: String,
      required: true,
    },
    expireAt: Date,
    purpose: {
      type: String,
      enum: platformConstants.otpPurpose,
      required: true,
    },
    isVerified: Boolean,
  },
  { timestamps: true }
);

export const OtpModel = model<IOtp>("Otp", otpSchema);

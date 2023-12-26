import { Document, Types } from "mongoose";
import { IToken } from "../../../utils/types";
import platformConstants from "../../../configs/platfromContants";

export interface IAuth extends Document {
  User: Types.ObjectId;
  password: string;
  lastLoginAt: Date;
  failedLoginAttempts: number;
  sessions: [
    {
      used: number;
      sessionId: string;
      deviceId: string;
      maxLifespan: number;
      maxInactivity: number;
      isLoggedOut: Boolean;
      device: {
        info: String;
        geoip: {
          lat: number | null;
          long: number | null;
        };
      };
    }
  ];
  isVerified: Boolean;

  //methods
  comparePassword(password: string): boolean;

  generateToken(args: {
    data: IToken;
    expiresIn?: number;
    audience?: "web" | "app";
  }): string;

  randomOTP(): string;
}

export interface IOtp extends Document {
  User: Types.ObjectId;
  code: string;
  expireAt: Date;
  purpose: (typeof platformConstants.otpPurpose)[number];
  isVerified: boolean;
}

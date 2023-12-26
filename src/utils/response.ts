import { Response } from "express";
import { ulid } from "ulidx";

import appConfig from "../configs";
import {
  IRequest,
  handleResponseArgType,
  handleSessionResArgType,
} from "./types";
import { IUserSession } from "../components/v2/auth/auth.types";

export const handleResponse = ({
  res,
  data,
  status = 200,
  err,
  message,
}: handleResponseArgType): Response => {
  if (err && appConfig.isDev) console.log(err);

  if (status >= 400) {
    if (err && err.name && err.name === "MongoError") {
      if (err.code === 11000)
        return res.status(400).json({
          message: "duplicate detected",
        });
    }
  }

  return res.status(status).json({
    message,
    data,
  });
};

export const commitSessionWithResponse = async ({
  res,
  data,
  status = 200,
  message,
  session,
  err = null,
}: handleSessionResArgType) => {
  await session.commitTransaction();
  session.endSession();

  return handleResponse({ res, data, status, message, err });
};

export const abortSessionWithResponse = async ({
  res,
  data,
  status = 200,
  err = null,
  message,
  session,
}: handleSessionResArgType) => {
  await session.abortTransaction();
  session.endSession();

  return handleResponse({ res, data, status, message, err });
};

export const createNewSession = (req: IRequest): IUserSession => ({
  used: 1,
  deviceId: req.fingerprint.deviceHash,
  sessionId: ulid(),
  lastEventTime: new Date(),
  maxLifespan: appConfig.authConfigs.sessionLifespan,
  maxInactivity: appConfig.authConfigs.maxInactivity,
  isLoggedOut: false,
  device: {
    info: req.fingerprint.components.userAgent,
    geoip: {
      lat: null,
      long: null,
    },
  },
});

export const failedLoginDelayTime = (
  lastLoginAt: Date,
  failedLoginAttempt: number
) => {
  const now = Date.now();
  let timePassed = lastLoginAt ? now - lastLoginAt.getTime() : 0;

  if (failedLoginAttempt < 5) {
    return {
      allowedLoginAttempt: 5,
      msBeforeNext: 0,
    };
  } else {
    let delay = 1000 * 60 * 30; //30mins

    return {
      allowedLoginAttempt: 5,
      msBeforeNext: Math.max(delay - timePassed, 0),
    };
  }
};

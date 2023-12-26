import { NextFunction, Request, Response } from "express";
import platformConstants from "../configs/platfromContants";
import { IRequest } from "../utils/types";
import { handleResponse } from "../utils/response";

type allowedRoles = (typeof platformConstants.role)[number];

function grantRoles(roles: allowedRoles[]) {
  return (req: IRequest, res: Response, next: NextFunction) => {
    const { user } = req;

    if (roles.includes(user.role)) {
      next();
    } else {
      return handleResponse({
        res,
        status: 401,
        message: `${user.role}s are not authorized to perform this operation`,
      });
    }
  };
}

export default grantRoles;

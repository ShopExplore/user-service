import { Router } from "express";
import policyMiddleware from "../../../appMiddlewares/policy.middlewares";
import {
  acceptInviteSchema,
  getInviteSchema,
  inviteSchema,
  searchSchema,
} from "./user.policies";
import requireAuth from "../auth/authMiddlewares/requireAuth";
import searchUsers from "./userActions/searchUsers";
import { validateTokenMiddleware } from "../auth/authMiddlewares";
import grantRoles from "../../../appMiddlewares/hasPermission";
import sendInvite from "./userActions/sendInvite";
import acceptInvite from "./userActions/acceptInvite";
import getInvite from "./userActions/getInvites";

const router = Router();

router.get(
  "/",
  policyMiddleware(searchSchema, "query"),
  validateTokenMiddleware,
  requireAuth,
  searchUsers
);

router.post(
  "/invite",
  policyMiddleware(inviteSchema),
  validateTokenMiddleware,
  requireAuth,
  grantRoles(["admin"]),
  sendInvite
);

router.post(
  "/accept-invite",
  policyMiddleware(acceptInviteSchema),
  acceptInvite
);

router.get(
  "/invites",
  policyMiddleware(getInviteSchema, "query"),
  validateTokenMiddleware,
  requireAuth,
  grantRoles(["admin"]),
  getInvite
);

//get suppliers
//delete invite
const userRouter = router;
export default userRouter;

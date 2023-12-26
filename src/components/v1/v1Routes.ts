import { Router, Response } from "express";
import authRoutes from "./auth/auth.routes";
import { handleResponse } from "../../utils/response";
import userRouter from "./user/user.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRouter);

router.get("/", (_req, res: Response) => {
  handleResponse({
    res,
    message: "welcome to the ShopExplore",
  });
});

const v1Routers = router;
export default v1Routers;

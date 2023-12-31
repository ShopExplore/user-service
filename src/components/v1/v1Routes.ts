import { Router, Response, Request, NextFunction } from "express";
import authRoutes from "./auth/auth.routes";
import { handleResponse } from "../../utils/response";
import userRouter from "./user/user.routes";
import customer_service from "../../utils/event";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRouter);

router.get("/", (_req, res: Response) => {
  handleResponse({
    res,
    message: "welcome to the ShopExplore user service",
  });
});

// const customerService =
router.use(
  "/customer-event",
  async (req: Request, res: Response, next: NextFunction) => {
    const { payload } = req.body;

    const response = await customer_service.subscribeEvents(payload);

    console.log(
      "============= Customer Service Received Event================"
    );
    res.json(response);
  }
);

const v1Routers = router;
export default v1Routers;

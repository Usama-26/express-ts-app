import { Router, Request, Response } from "express";
import userRouter from "./user.routes";
import authRouter from "./auth.routes";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({ message: "API V1 is live. 🚀" });
});

router.use("/users", userRouter);
router.use("/auth", authRouter);
export default router;

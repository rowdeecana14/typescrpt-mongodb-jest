import { Router } from "express";
import { useAuthRoute } from "./routes/AuthRoute";

const router = Router();

router.use("/auth", useAuthRoute);

export default router;

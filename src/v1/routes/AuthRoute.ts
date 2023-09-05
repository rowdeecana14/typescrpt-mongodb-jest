import { Router } from "express";
import LoginAuthRequest from "../requests/auth/LoginAuthRequest";
import AuthController from "../controllers/AuthController";

const router = Router();

router.post("/login", LoginAuthRequest.validate, AuthController.login);
router.post("/register", LoginAuthRequest.validate, AuthController.register);
router.post("/logout", LoginAuthRequest.validate, AuthController.logout);

export { router as useAuthRoute };

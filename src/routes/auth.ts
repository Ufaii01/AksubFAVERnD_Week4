import { Router } from "express";
import AuthController from "../controllers/authController";
import { authenticate, authorize } from "../middleware/auth";
import { rateLimiter } from "../middleware/rateLimiter";

const authRouter = Router();

authRouter.post("/Register", rateLimiter, AuthController.register);
authRouter.post("/Login", rateLimiter, AuthController.login);

export default authRouter;
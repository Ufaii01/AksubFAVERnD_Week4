import { Router } from "express";
import AuthController from "../controllers/authController";
import { authenticate, authorize } from "../middleware/auth";

const authRouter = Router();

authRouter.post("/Register", AuthController.register);
authRouter.post("/Login", AuthController.login);

export default authRouter;
import { Request, Response, NextFunction } from "express";
import AuthService from "../services/authService"; 
import { ok, created, fail } from "../utils/response";

class AuthController {
    static register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await AuthService.register(req.body);
            return created(res, result, "User registered successfully");
        } catch (error) {
            next(error);
        }
    };

    static login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await AuthService.login(req.body);
            return ok(res, result, "User logged in successfully");
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;
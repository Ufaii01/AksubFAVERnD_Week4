import { Request, Response, NextFunction } from "express";
import AuthService from "../services/authService"; 

class AuthController {
    static register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = AuthService.register(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };

    static login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = AuthService.login(req.body);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;
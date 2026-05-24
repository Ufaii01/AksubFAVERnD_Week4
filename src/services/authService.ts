import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { registerSchema } from "../validations/authValidation";
import AuthRepository  from "../repositories/authRepository";
import AppError from "../utils/appError";

class AuthService {
    static register = async (data: any) => {
        const validatedData = registerSchema.safeParse(data);
        if (!validatedData.success) {
            throw new AppError(validatedData.error.message, 400);
        }
        const { name, email, password } = validatedData.data;
        const existingUser = await AuthRepository.findByEmail(email);
        if (existingUser) {
            throw new AppError("User already exists", 409);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        return AuthRepository.register({ name, email, password: hashedPassword });
    }

    static login = async (data: any) => {
        const { email, password } = data;
        const existingUser = await AuthRepository.findByEmail(email);
        if (!existingUser) {
            throw new AppError("Invalid email", 401);
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            throw new AppError("Invalid password", 401);
        }

        const token = jwt.sign(
            { id: existingUser.id, role: existingUser.role }, //payload
            process.env.JWT_SECRET as string, //signature
            { expiresIn: '1d' } //duration
        );
        
        return { token };
    }
}

export default AuthService;
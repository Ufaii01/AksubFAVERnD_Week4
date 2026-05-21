import { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  id: number;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export type { TokenPayload };
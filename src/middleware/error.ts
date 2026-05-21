import { Response, Request, NextFunction } from "express"
import { ZodError } from "zod"
import { internalError } from "../utils/response"

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if(err === 400) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }

    if(err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }

    if (err.status === 403) {
        return res.status(403).json({
            success: false,
            message: err.message
        });
    }

    return internalError(res, err.message || "Internal Server Error");
}

export default errorHandler
import { Response, Request, NextFunction } from "express"
import { ZodError } from "zod"
import { internalError } from "../utils/response"

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }

    if (err.status === 400) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }

    if (err.status === 401) {
        return res.status(401).json({
            success: false,
            message: err.message
        })
    }

    if (err.status === 403) {
        return res.status(403).json({
            success: false,
            message: err.message
        })
    }

    if (err.status === 404) {
        return res.status(404).json({
            success: false,
            message: err.message
        })
    }

    if (err.status === 409) {
        return res.status(409).json({
            success: false,
            message: err.message
        })
    }

    return internalError(res, err.message || "Internal Server Error");
}
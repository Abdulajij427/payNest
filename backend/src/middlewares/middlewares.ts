import { JWT_SECRET } from "../config.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import {
    type Request,
    type Response,
    type NextFunction
} from "express";


const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    // 1. Check whether Authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({
            message: "Authorization header missing"
        });
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];

    // 3. Make sure token exists
    if (!token) {
        return res.status(403).json({
            message: "Token missing"
        });
    }

    try {
        // 4. Verify token
        const decoded = jwt.verify(
            token,
            JWT_SECRET
        ) as JwtPayload;

        // 5. Attach userId to request
        (req as any).userId = decoded.id;

        // 6. Continue to the next middleware/route
        return next();

    } catch (err) {
        return res.status(403).json({
            message: "Invalid or expired token"
        });
    }
};

export default authMiddleware;



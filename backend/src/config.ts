import "dotenv/config";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error("JWT_SECRET must be set in the environment");
}
export const JWT_SECRET = secret;
export const PORT = Number(process.env.PORT) || 3000;


export const generateToken = (id: number): string => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });
}



export default JWT_SECRET;

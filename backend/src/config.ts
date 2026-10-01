import jwt from "jsonwebtoken";

const JWT_SECRET = "abdulShaikh123";


export const generateToken = (id: number): string =>{
    return jwt.sign({id}, JWT_SECRET );
}



export default JWT_SECRET;
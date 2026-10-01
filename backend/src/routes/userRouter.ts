import {Router ,type Request , type Response} from 'express';
import {pool} from '../db.js'
import bcrypt from 'bcrypt';

export const userRouter = Router();

// 1. signup
userRouter.post('/user/signup' , async (req: Request , res: Response)=>{
    const {username , password , firstName , lastName} = req.body;

    const hashedPassword = await bcrypt.hash(password , 10);

    const insertQuery = 
    `
    INSERT INTO users (username , password , firstName , lastName)
    VALUES ($1 , $2 , $3 , $4)
    RETURNING id , username , firstName , lastName
    `;

    const result = await pool.query(insertQuery , [
        username,
        hashedPassword,
        firstName,
        lastName
    ]);


})





// signin
userRouter.get('/api/v1/signin', async (req: Request , res: Response)=>{
    const {username , password , firstName , lastName} = req.body;



})
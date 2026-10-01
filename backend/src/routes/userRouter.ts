import {Router ,type Request , type Response} from 'express';
import {pool} from '../db.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import JWT_SECRET from '../config.js'
import {createUserSchema , userIdParamsSchema } from '../schema/schema.js'
import users from '../db.js'
import {getUsernameById} from '../db.js'
import {generateToken} from '../config.js';



 const userRouter = Router();

// 1. signup
userRouter.post('/api/v1/user/signup' , async (req: Request , res: Response)=>{
    const {username , password , firstName , lastName} = req.body;
    const hashedPassword = await bcrypt.hash(password , 10);


    const {success} = createUserSchema.safeParse(req.body);

    if(!success){
        return res.status(411).json({
            message: "email already taken / Incorrect inputs"
        })
    }


    const existingUser = await getUsernameById(Number(req.params.id));
    

    if(existingUser){
        return res.status(411).json({
            message: "email already taken/incorrect inputs"
        })
    }

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




    // generate token
    const {rows} = await pool.query(
        "SELECT id, password FROM users WHERE username = $1",
        
    );
    const user = rows[0];

    const token = generateToken(user.id);
    res.json({token});


});





// signin
userRouter.get('/api/v1/user/signin', async (req: Request , res: Response)=>{
    

    //1. Input validate
   const parsed = createUserSchema.safeParse(req.body);
   if (!parsed.success){
        return res.status(411).json({message : "Invalid input"});
   }

   const {username , password} = parsed.data;

   // 2. DB se user nikalo
   const {rows} = await pool.query(
    "SELECT id , password FROM users WHERE username = $1",
    [username]
   );
   const user = rows[0];

   // 3. user nhi mila ya password galat
   if(!user || !(await bcrypt.compare(password , user.password))){
    return res.status(411).json({ message: "Wrong username or password" });
   }



   // 4. token banao
   const token = jwt.sign({id: user.id} , process.env.JWT_SECRET as string );
   

   // 5. success
   return res.status(200).json({token});





});
export default userRouter;
import {Router ,type Request , type Response} from 'express';
import {pool} from '../db.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import {createUserSchema , userIdParamsSchema } from '../schema/schema.js'
import users from '../db.js'
import {getUsernameById} from '../db.js'
import {generateToken} from '../config.js';
import authMiddleware from '../middlewares/middlewares.js'
import {getAllUsers} from '../db.js'

 const userRouter = Router();

// 1. signup
userRouter.post("/api/v1/user/signup", async (req: Request, res: Response) => {
  // 1. Pehle validate
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(411).json({ message: "Incorrect inputs" });
  }

  const { username, password, firstName, lastName } = parsed.data;

  try {
    // 2. Username already hai ya nahi (username se check)
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );
    if (existingUser.rows.length > 0) {
      return res.status(411).json({ message: "Username already taken" });
    }

    // 3. Ab hash karo
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Insert, id RETURNING se hi mil jati hai
    const { rows } = await pool.query(
      `INSERT INTO users (username, password, first_name, last_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [username, hashedPassword, firstName, lastName]
    );

    // 5. Token
    const token = generateToken(rows[0].id);
    return res.status(200).json({ message: "User created successfully", token });
  } catch (err: any) {
    // do requests ek saath aayi to DB ka UNIQUE constraint pakad lega
    if (err.code === "23505") {
      return res.status(411).json({ message: "Username already taken" });
    }
    return res.status(500).json({ message: "Server error" });
  }
  

    

});





// signin
userRouter.get('/api/v1/user/signin' , async (req: Request , res: Response)=>{
    

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


// get all users information
userRouter.get('/bulk', authMiddleware ,async (req: Request , res: Response) =>{
    try{
        const page = Math.max(Number(req.query.page) || 1,1);
        const limit = Math.min(Number(req.query.limit) || 20, 100);
        const offset = (page - 1) * limit;

        const users = await getAllUsers(limit , offset);

        return res.status(200).json({page , limit , users});
    } catch{
        return res.status(500).json({message: "server error"});
    }
});




//updating user information 
userRouter.put('/', authMiddleware , async( req: Request , res: Response)=>{
    const {success} = createUserSchema.safeParse(req.body);

    if(!success){
        return res.status(411).json({
            message: "error while updating "
        })
    }


    const {username , id} = req.body;
    const result = await pool.query(
        `UPDATE users
         SET username = $1
         WHERE id = $1
         RETURNING id , username`,
        [username , id]
    )

    res.json({
        message: "updated successfully"
    })

    
})
export default userRouter;



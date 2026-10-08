import { Router ,type NextFunction , type Request , type Response} from 'express';
import authMiddleware from '../middlewares/middlewares.js'
import {transferSchema} from '../schema/schema.js'
import {transferMoney} from '../db.js'
import {getBalanceByUserId} from '../db.js'


const accountRouter = Router();

accountRouter.post("/transfer", authMiddleware , async (req: Request , res: Response)=>{
    const parsed = transferSchema.safeParse(req.body);

    if(!parsed.success){
        return res.status(400).json({message: "Enter a valid recipient and amount"});
    }

    const {to , amount} = parsed.data;
    const fromId = req.userId!;

    if(fromId === to){
        return res.status(400).json({message :"cannot transfer to yourself"});
    }

    try{
        await transferMoney(fromId , to , amount);
        res.status(200).json({message: "transfer successful"});
    }catch(err: any){
        if (err.message === "INSUFFICIENT_BALANCE")
        return res.status(400).json({ message: "Insufficient balance" });
        if (err.message === "ACCOUNT_NOT_FOUND")
        return res.status(400).json({ message: "Invalid account" });
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


accountRouter.get("/balance", authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.userId!;
        const balance = await getBalanceByUserId(userId);

        if (balance === null) {
            return res.status(404).json({ message: "Account not found" });
        }
        return res.status(200).json({ balance });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});

export default accountRouter;

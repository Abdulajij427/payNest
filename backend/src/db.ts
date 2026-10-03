import {Pool} from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});



export const getUsernameById = async (id: number)=>{
    const {rows} = await pool.query(
        "SELECT username FROM users WHERE id = $1",
        [id]
    );
    return rows[0]?.username ?? null;
};



export default async function users(){
    try{
        await pool.query(
            `
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            username VARCHAR(100) NOT NULL,
            password VARCHAR(100) NOT NULL,
            firstName VARCHAR(100) NOT NULL,
            lastName VARCHAR(100) NOT NULL
            );
            ` 
        );
        console.log("users table created or already exists")
    }catch(error){
        console.error("error creating table:", error);
        throw error;
    }
}


export  async function account(){
    try{
        await pool.query(
            `
            CREATE TABLE account(
            id SERIAL PRIMARY KEY,
            balance NUMERIC(12,2) NOT NULL CHECK (balance >= 0),
            userId INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE
            );
            `
        );
        console.log("account table created or aleready exists")
    } catch(error){
        console.error("error creating table:",error);
        throw error;
    }
}



export async function getAllUsers( limit = 20, offset = 0 ){
    const { rows } = await pool.query(
        `
        SELECT id, 
            username,
            first_name AS "firstName",
            last_name AS "lastName"
        FROM users
        ORDER BY id
        LIMIT $1 OFFSET $2    
        `,
        [limit , offset]
    );
    return rows;
};







//transactions or transfer money
export async function transferMoney(
    fromId: number,
    toId: number,
    amount: number
){
    const client = await pool.connect();

    try{
        await client.query("BEGIN");

        const {rows} = await client.query(
            `
            SELECT user_id AS userId , balance FROM account
            WHERE user_id = ANY($1)
            ORDER BY user_id
            FOR UPDATE
            `,
            [[fromId , toId]]
        );

        const sender = rows.find((r)=> r.user_id === fromId);
        if(!sender || rows.length !== 2)  throw new Error("ACCOUNT_NOT_FOUND");
        if(Number(sender.balance) < amount) throw new Error("INSUFFICIENT_BALANCE");

        await client.query(
            `UPDATE account SET balance = balance - $1 WHERE user_id = $2`,
            [amount , fromId]
        );

        await client.query(
            `UPDATE account SET balance = balance + $1 WHERE user_id = $2`,
            [amount , toId]
        );

        await client.query("COMMIT");

    } catch(err){
        await client.query("ROLLBACK");
        throw err;
    }finally{
        client.release();
    }
};














// agar usr search kare dusre user ko
export async function searchUsers(
    q: string,
    currentUserId: number,
    limit: number,
    offset: number
){
    const {rows} = await pool.query(
        `
        SELECT id,
            username,
            first_name AS "firstName",
            last_name AS "lastName"
        FROM users
        WHERE id <> $1
            AND (username ILIKE $2
                OR first_name ILIKE $2
                OR last_name  ILIKE $2)
        ORDER BY username
        LIMIT $3 OFFSET $4            
        `,
        [currentUserId , limit , offset]
    );
    return rows;
}
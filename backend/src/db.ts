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
            balance INTEGER NOT NULL,
            userId INTEGER REFERENCES users(id)
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
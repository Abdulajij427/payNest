import {Pool} from "pg";
import dotenv from "dotenv";


dotenv.config();

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});



async function users(){
    
    const users = await pool.query(`
        CREATE TABLE IF NOT EXISTS users 
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(200) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL
        
    `);
       console.log("tables created");
       await pool.end();     
            
    
}


users().catch((err)=>{
    console.error(err);
    process.exit(1);
});
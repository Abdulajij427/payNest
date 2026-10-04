# PayNest

A full-stack digital wallet app inspired by Paytm. Users can sign up, sign in, see their wallet balance, search for other users, and send money to them. Transfers run inside PostgreSQL transactions, so money is never lost or created halfway.

## Features

- **Signup and signin** with JWT authentication
- **Password hashing** with bcrypt
- **Input validation** with Zod on every request
- **Starting balance:** every new user gets a random balance between 1 and 10,000
- **Dashboard** showing the logged-in user's name and wallet balance
- **User list and search** (by username, first name or last name) with pagination
- **Send money** to another user
- **Safe transfers:** the sender's and receiver's rows are locked (`SELECT ... FOR UPDATE`) and the debit and credit happen in one transaction (`BEGIN` / `COMMIT` / `ROLLBACK`), so a transfer either fully succeeds or fully fails
- **Protected routes:** the user id always comes from the JWT, never from the request body

## Tech Stack

| Layer | Tools |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL (plain `pg`, no ORM) |
| Auth and validation | JWT (`jsonwebtoken`), bcrypt, Zod |

## Screenshots

_Add screenshots of the Signup, Dashboard and Send Money pages here._

## Project Structure

```
paytm/
├── backend/
│   └── src/
│       ├── index.ts            # app entry, route mounting
│       ├── db.ts               # pool, table creation, SQL functions
│       ├── config.ts           # JWT token helper
│       ├── middlewares/        # auth middleware
│       ├── routes/             # userRouter, accountRouter
│       └── schema/             # Zod schemas
└── frontend/
    └── src/
        ├── pages/              # Signup, Signin, Dashboard, SendMoney
        └── components/         # Appbar, Balance, Users, InputBox, Button ...
```

## Database

Two tables, created automatically when the server starts:

```sql
users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,        -- bcrypt hash
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL
)

account (
  id SERIAL PRIMARY KEY,
  balance NUMERIC(12,2) NOT NULL CHECK (balance >= 0),
  user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE
)
```

The `CHECK (balance >= 0)` constraint is a second line of defence: the database itself refuses to let a balance go negative.

## API Endpoints

Base URL: `http://localhost:3000/api/v1`

Protected routes need the header `Authorization: Bearer <token>`.

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/user/signup` | No | Create an account, get a token. Also creates the wallet with a random starting balance |
| POST | `/user/signin` | No | Log in, get a token |
| GET | `/user/me` | Yes | Logged-in user's profile |
| GET | `/user/bulk` | Yes | List users (`?page=1&limit=20`) |
| GET | `/user/search` | Yes | Search users (`?q=abd&page=1&limit=10`) |
| GET | `/account/balance` | Yes | Logged-in user's balance |
| POST | `/account/transfer` | Yes | Send money, body: `{ "to": 2, "amount": 100 }` |

Validation failures return status `411` with a message.

## How a Transfer Works

1. The route validates the body with Zod and takes the sender id from the JWT.
2. A dedicated connection is taken from the pool and a transaction starts.
3. Both account rows are locked in a fixed order (this avoids deadlocks).
4. If the sender's balance is too low, the transaction is rolled back.
5. Otherwise the sender is debited, the receiver is credited, and the transaction is committed.

## Getting Started

### Prerequisites

- Node.js 18 or newer
- PostgreSQL running locally

### 1. Clone

```bash
git clone https://github.com/<your-username>/PayNest.git
cd PayNest
```

### 2. Create the database

```bash
psql -U postgres
```

```sql
CREATE DATABASE paynest;
```

### 3. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/paynest
JWT_SECRET=use_a_long_random_string
PORT=3000
```

Start the server (tables are created on startup):

```bash
npm run dev
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`, sign up, and you will land on the dashboard with your starting balance.

## Security Notes

- Passwords are stored only as bcrypt hashes and are never returned by any endpoint.
- All SQL uses parameterized queries.
- `.env` is git-ignored, so secrets never reach the repository.
- Money is stored as `NUMERIC`, not floating point.

## Future Improvements

- Transaction history page
- Token expiry and refresh flow
- Rate limiting on auth and search routes
- Tests for the transfer logic (including concurrent transfers)
- Deployment with a live demo link

## Author

**Abdul** - self-taught web developer.

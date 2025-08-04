# Demo Credit

Demo Credit is a Node.js/TypeScript backend for a mobile lending app, providing wallet functionality for borrowers to receive loans and make repayments. This MVP supports user onboarding, wallet funding, transfers, withdrawals, and blacklist checks via the Lendsqr Adjutor Karma API.

## Features

- **User Onboarding:** Users can sign up and create accounts.
- **Wallet Funding:** Users can deposit money into their wallets.
- **Wallet Transfer:** Users can transfer funds to other users.
- **Wallet Withdrawal:** Users can withdraw funds from their wallets.
- **Blacklist Check:** Users on the Karma blacklist cannot be onboarded.

## Tech Stack

- Node.js, TypeScript
- Express.js
- MySQL (via Knex)
- Redis (for caching)
- JWT (authentication)
- Joi (validation)
- Jest (testing)

## Project Structure

- `src/` – Source code (controllers, services, repositories, entities, etc.)
  - `common/`
  - `controllers/`
  - `data/`
    - `entities/`
    - `enums/`
    - `interfaces/`
    - `migrations/`
  - `helpers/`
  - `middlewares/`
  - `repositories/`
  - `routes/`
  - `services/`
  - `types/`
  - `App.ts`
  - `index.ts`
  - `knexfile.ts`
- `tests/`

## Getting Started

1. **Install dependencies:**

   ```sh
   npm install
   ```

2. **Configure environment variables:**  
   Copy `.env.example` to `.env` and fill in your settings.

3. **Run database migrations:**

   ```sh
   npm run migrate:dev
   ```

4. **Start the server:**

   ```sh
   npm run dev
   ```

5. **Run tests:**
   ```sh
   npm test
   ```

## API Endpoints

- `POST /api/v1/auth/signup` – Create a new user account
- `POST /api/v1/auth/login` – Login and receive JWT
- `GET /api/v1/me` – Get the logged in user's profile
- `PATCH /api/v1/me/password` – Update user password
- `PATCH /api/v1/logout` – Get the logged in user's profile
- `PUT /api/v1/settlement-accounts` – Set settle account details
- `POST /api/v1/wallets/deposit` – Fund wallet
- `POST /api/v1/wallets/withdraw` – Withdraw from wallet
- `POST /api/v1/wallets/transfer` – Transfer funds to another user

## Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USER ||--o{ WALLET : owns
    USER ||--o{ PASSWORD : has
    USER ||--o{ LOGIN_SESSION : has
    USER ||--o{ SETTLEMENT_ACCOUNT : has
    WALLET ||--o{ LOCKED_FUND : locks
    WALLET ||--o{ TRANSACTION : involved_in
    USER ||--o{ TRANSACTION : initiates
    SETTLEMENT_ACCOUNT ||--o{ TRANSACTION : settles
    LOCKED_FUND ||--o{ TRANSACTION : secures

    USER {
      int id PK
      string first_name
      string last_name
      string email
      string phone
      string address
      date dob
      enum status
    }
    WALLET {
      int id PK
      decimal balance
      decimal ledger_balance
      int user_id FK
      int settlement_account_id FK
      enum type
      enum status
    }
    PASSWORD {
      int id PK
      string password
      string email
      int user_id FK
      enum status
    }
    LOGIN_SESSION {
      int id PK
      date expiry_date
      bool is_expired
      bool logged_out
      int user_id FK
      int status
    }
    SETTLEMENT_ACCOUNT {
      int id PK
      int user_id FK
      string account_name
      string account_number
      string bank_name
      enum status
    }
    LOCKED_FUND {
      int id PK
      int wallet_id FK
      int user_id FK
      decimal amount
      string reason
    }
    TRANSACTION {
      int id PK
      decimal amount
      decimal charges
      int sender_user_id FK
      int recipient_user_id FK
      int source_wallet_id FK
      int destination_wallet_id FK
      int settlement_account_id FK
      int locked_fund_id FK
      enum type
      enum channel
      enum status
      date completed_at
      string reference
    }
```

## Blacklist Integration

During signup, the system checks the user's identity against the Karma blacklist API. If a record is found, onboarding is blocked.

## Testing

Tests are written using Jest and cover both positive and negative scenarios for wallet operations.  
Run tests with:

```sh
npm test
```

## License

ISC

---

**Author:** Goodness

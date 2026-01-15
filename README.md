# OnlineAuction

OnlineAuction is a full-stack web application for an online auction marketplace. It supports multiple roles (Guest, Bidder, Seller, Admin), auction workflows, notifications, and post-auction processes.

---

## Highlights

- Full auction workflow: listing, bidding, watchlist, auto-extend, buy-now, and badges
- Role-based system: Guest, Bidder, Seller, Admin
- Secure auth: JWT + bcrypt, email OTP flows
- Email notifications for key auction events
- PostgreSQL on Supabase with structured data design

---

## Tech Stack

Backend
- Node.js + Express
- TypeScript
- PostgreSQL (Supabase)
- Knex.js
- JWT, bcrypt
- Nodemailer
- Multer (uploads)
- node-cron (scheduled jobs)

Frontend
- React + Vite
- Tailwind CSS
- Radix UI components
- React Router
- reCAPTCHA integration

---

## Project Structure

OnlineAuction/
- BE/                   Backend (Express + TypeScript)
  - src/
  - package.json
  - .env
- FE/                   Frontend (React + Vite)
  - src/
  - package.json
  - .env
- ERD.png
- UseCase.md
- README.md

---

## Core Features

Guest
- Browse categories
- View product list by category
- Home page recommendations
- Full-text search + sort
- View product details
- Register account + email OTP
- Login

Bidder
- Add/remove watchlist
- Place bid + confirm bid
- View bid history
- Ask seller questions
- Profile management
- Change password
- View rating overview + history
- View ongoing/participated auctions
- View won auctions
- Rate seller (+1 / -1) with comment
- Request upgrade to Seller

Seller
- Create auction listing
- Upload product images
- Append descriptions
- Set start price, bid step, buy-now price
- Enable/disable auto-extend
- Manage active/finished listings
- Reply to questions
- Block/reject bidders
- Rate winning bidder (+1 / -1) with comment
- Cancel transaction

Admin
- Manage categories (CRUD, delete only if empty)
- Remove products
- Manage users (view/edit/delete)
- Approve/reject seller upgrade requests
- System settings (auto-extend config, platform settings)

System (Automation + Email)
- Bid success email
- Notify previous highest bidder
- Notify bidder blocked
- Auction end: winner & seller
- Auction end: no winner
- Notify new question / answered question
- Password recovery with OTP

---

## Badge Rules

- HOT: number of bids > 7
- ENDING SOON: remaining auction time < 3 days
- NEW: created within last 60 minutes

Priority (if multiple): HOT > ENDING SOON > NEW

---

## Post-Auction Workflow

1. Winner submits payment + shipping address
2. Seller confirms payment
3. Seller provides shipping bill
4. Winner confirms item received
5. Both parties rate each other

---

## Environment Variables

Backend: BE/.env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret_key

Frontend: FE/.env
VITE_API_BASE_URL=http://localhost:5000

---

## Database Setup (Supabase)

1. Create a Supabase project
2. Copy SUPABASE_URL, SUPABASE_ANON_KEY, and DATABASE_URL
3. Run the provided SQL schema in Supabase SQL editor
4. Verify tables: users, products, bids, orders, ratings, categories, auto_bids, questions, answers, etc.

---

## Run Locally

Backend
cd BE
npm install
npm run dev

Backend runs at http://localhost:5000

Frontend
cd FE
npm install
npm run dev

Frontend runs at http://localhost:5173

---

## Demo Accounts (Optional)

If you plan to publish this repo publicly, do not keep real credentials here. Use placeholders or remove this section.

Example format:
- Bidder: user@example.com / password
- Seller: seller@example.com / password
- Admin: admin@example.com / password

---

## API Overview (High-Level)

- Auth: register, login, OTP verify, password reset
- Products: list, detail, search, filter, create (seller)
- Bids: place bid, bid history, auto-extend handling
- Watchlist: add/remove
- Ratings: submit and view
- Admin: users, categories, products, seller upgrade approvals

---

## Notes

- Frontend and Backend are decoupled.
- UseCase details are in UseCase.md.
- Database design is documented in ERD.png.

---

## License

This project is for educational purposes.

====================================================
ONLINE AUCTION PLATFORM
Setup & Deployment Guide
====================================================

This document provides step-by-step instructions to set up and run
the full Online Auction project, including database, backend, and frontend.

----------------------------------------------------
1. SYSTEM REQUIREMENTS
----------------------------------------------------

Before starting, make sure the following software is installed:

- Node.js version 18 or higher
- npm (comes with Node.js)
- A Supabase account (for PostgreSQL database)
- Git (optional, for cloning the repository)

----------------------------------------------------
2. DATABASE SETUP (SUPABASE - POSTGRESQL)
----------------------------------------------------

This project uses Supabase as a cloud PostgreSQL database.

Step 1: Create a Supabase Project
- Go to https://supabase.com
- Create a new project
- Save the following credentials:
  - SUPABASE_URL
  - SUPABASE_ANON_KEY
  - Database connection string (DATABASE_URL)

Step 2: Create Database Tables
- Open Supabase Dashboard
- Go to SQL Editor
- Run the provided SQL schema file (i have included)
  or manually create required tables:
  - users
  - products
  - bids
  - orders
  - ratings
  - categories
  - auto-bids (or related tables)
  ...

----------------------------------------------------
3. BACKEND SETUP (EXPRESS - NODE.JS)
----------------------------------------------------

Step 1: Navigate to backend folder
Open a terminal and run:
  cd be

Step 2: Install backend dependencies
All backend dependencies are defined in package.json.
Run:
  npm install

Step 3: Configure environment variables
Create a file named ".env" inside the backend folder (i have included) with the following content:

  PORT=5000
  DATABASE_URL=your_postgresql_connection_string
  SUPABASE_URL=your_supabase_url
  SUPABASE_ANON_KEY=your_supabase_anon_key
  JWT_SECRET=your_jwt_secret_key
  ...

Step 4: Start backend server
Run:
  npm run dev

If successful, the backend server will run at:
  http://localhost:5000

----------------------------------------------------
4. FRONTEND SETUP (REACT + TAILWIND CSS)
----------------------------------------------------

Step 1: Navigate to frontend folder
Open a new terminal and run:
  cd fe

Step 2: Install frontend dependencies
All frontend dependencies are defined in package.json.
Run:
  npm install

Step 3: Configure environment variables
Create a file named ".env" inside the frontend folder (i have included) with the following content:

  VITE_API_BASE_URL=http://localhost:5000
  ...

Step 4: Start frontend application
Run:
  npm run dev

If successful, the frontend application will run at:
  http://localhost:5173

----------------------------------------------------
5. PROJECT STRUCTURE
----------------------------------------------------

OnlineAuction/
│
├── be/                 Backend (Express, Node.js)
│   ├── src/
│   ├── package.json
│   └── .env
│
├── fe/                 Frontend (React, Tailwind CSS)
│   ├── src/
│   ├── package.json
│   └── .env
│
└── readme.txt

----------------------------------------------------
6. DEPENDENCY MANAGEMENT NOTE
----------------------------------------------------

This project is built using Node.js.
All dependencies are managed using package.json and package-lock.json.

----------------------------------------------------
7. RUNNING THE FULL SYSTEM
----------------------------------------------------

To run the complete system:

1. Start the backend server first
2. Then start the frontend application
3. Access the application via browser:
   http://localhost:5173

----------------------------------------------------
8. PRE-CREATED DEMO ACCOUNTS
----------------------------------------------------

For testing and demonstration purposes, the following accounts
are pre-created in the system.

----------------------------------------------------
BIDDER ACCOUNTS
----------------------------------------------------

Email: thieuhuy1711@gmail.com
Password: 123123123
User ID: c7a5a4e8-2731-455f-bff5-4d8c3fc3dc0b

Email: 123@gmail.com
Password: 123123123

Email: test1@gmail.com
Password: 123123123

Email: test2@gmail.com
Password: 123123123

Email: test3@gmail.com
Password: 123123123

Email: nguyennkhanh373@gmail.com
Password: 123456789

----------------------------------------------------
SELLER ACCOUNT
----------------------------------------------------

Email: lthuy171103@gmail.com
Password: 123123123

----------------------------------------------------
ADMIN ACCOUNT
----------------------------------------------------

Email: lthuy21@clc.fitus.edu.vn
Password: 123123123

----------------------------------------------------
9. PRODUCT BADGES RULES
----------------------------------------------------

The system automatically displays badges on products
based on the following conditions:

----------------------------------------------------
HOT BADGE
----------------------------------------------------
A product is marked as "HOT" if:
- Number of bids > 7

Purpose:
- Highlight products with high bidding activity
- Attract more user attention to competitive auctions

----------------------------------------------------
ENDING SOON BADGE
----------------------------------------------------
A product is marked as "Ending Soon" if:
- Remaining auction time < 3 days

Purpose:
- Create urgency for users to place bids before auction ends

----------------------------------------------------
NEW BADGE
----------------------------------------------------
A product is marked as "NEW" if:
- Product was created within the last 60 minutes

Purpose:
- Highlight newly listed items
- Improve visibility for new sellers and fresh listings

----------------------------------------------------
BADGE PRIORITY
----------------------------------------------------
If a product satisfies multiple conditions:
- Multiple badges may be displayed simultaneously
- Badge rendering priority (if applicable):
  HOT > ENDING SOON > NEW

----------------------------------------------------

# Resa Samaneh - Personal Finance Management

A modern web application for personal finance management, built with Next.js and Supabase. The project focuses on a clean architecture, strict type safety, and a seamless user experience.

## Overview

This project implements a robust dashboard for managing bank cards, tracking incomes and expenses, and setting financial reminders. It utilizes a Server/Client Component paradigm, optimistic UI updates, and strict database-level security.

## Features

- **Dashboard:** Real-time financial overview with Recharts integration for asset distribution and historical trends.
- **Card Management:** Add and manage bank cards securely.
- **Transaction Tracking:** Track incomes and expenses with categorization and live search.
- **Reminders:** Manage upcoming payments and debts.
- **State Management:** Server state synchronization using TanStack Query with optimistic updates.
- **Security:** JWT authentication via Supabase Auth and data isolation using PostgreSQL Row Level Security (RLS).
- **Type Safety:** Strict TypeScript configuration with no `any` types. Forms are validated via React Hook Form and Zod.

## Tech Stack

- **Frontend:** Next.js 14+ (App Router), React 18, TypeScript, Tailwind CSS
- **State Management:** TanStack React Query
- **Forms & Validation:** React Hook Form, Zod
- **UI & Animations:** Framer Motion, Recharts, Lucide React
- **Backend (BaaS):** Supabase (PostgreSQL, Auth, RLS)

## Architecture

The codebase follows the Feature-Sliced Design (FSD) methodology to maintain high cohesion and modularity:

```text
src/
├── app/                  # Next.js App Router
├── components/           # Shared UI components
├── features/             # Business logic modules
│   ├── auth/             
│   ├── cards/            
│   ├── dashboard/        
│   ├── profile/          
│   ├── reminders/        
│   └── transactions/     
├── lib/                  # Utilities and Supabase client
└── providers/            # React Context providers
```

## Database Schema

The database consists of normalized tables protected by RLS:
- `cards`: id, user_id, bank_name, card_number, balance
- `transactions`: id, user_id, card_id, amount, type, category, description, created_at
- `reminders`: id, user_id, title, amount, due_date, created_at

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Copy the example environment file and add your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```

3. **Database Migration:**
   Run the provided SQL schemas in your Supabase SQL Editor to set up tables and RLS policies.

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

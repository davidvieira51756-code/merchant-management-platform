# Merchant Management Platform

A small dashboard where merchants can manage their stores and each store's products. Supabase provides authentication and the PostgreSQL database, while Row Level Security keeps each merchant's data separate.

## Features

- Email and password signup, login, confirmation, and logout
- Create, view, edit, and deactivate stores
- Create, view, edit, and remove products
- Tenant isolation enforced by PostgreSQL Row Level Security (RLS)
- Form validation with Zod and React Hook Form

## Tech Stack

- Next.js 16, React 19, and TypeScript
- Tailwind CSS and ShadCN UI components
- Supabase Auth with SSR cookie handling
- Supabase PostgreSQL with RLS
- Zod and React Hook Form

## How it works

Users authenticate with Supabase. Each store has a `merchant_id` linked to the authenticated user, and each product belongs to a store through `store_id`.

PostgreSQL RLS policies allow merchants to read and change only their own stores and products. Browser CRUD calls Supabase directly and relies on those policies for authorization.

Stores are deactivated by setting `active = false` instead of deleting the row. Products can be removed permanently.

## Run locally

Requirements: Node.js, npm, and Docker. The Supabase CLI is installed with the project dependencies.

1. Install dependencies:

```bash
npm install
```

2. Start local Supabase:

```bash
npx supabase start
```

3. Apply migrations and load the seed data:

```bash
npx supabase db reset
```

4. Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Set these values using the local credentials printed by `npx supabase status`:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:55431
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<local-publishable-key>
```

5. Start Next.js:

```bash
npm run dev
```

Open http://127.0.0.1:3000.

## Useful commands

```bash
npm run lint
npm run build
npx supabase db reset
```

## Main technical decisions

- Next.js App Router separates server-rendered pages from client-side forms.
- Supabase SSR clients keep authentication sessions in cookies.
- The email confirmation Route Handler verifies a Supabase token hash before creating a session.
- Create, update, deactivate, and delete operations verify that an affected row is returned before reporting success.

## Scalability

The current dashboard loads complete store and product lists, which is appropriate for the scope of this challenge.

The database already includes indexes on store ownership and product relationships. If the amount of data grows, the main next step would be adding pagination to store and product queries so the application does not load large result sets at once.

## Notes

- Seeded Auth users are local fixtures for RLS testing, not login accounts.
- Browser CRUD is intentionally protected by PostgreSQL RLS.
- Hosted email confirmation requires enabling email confirmation, configuring the Site URL and redirect allow-list, and updating the Supabase confirmation email template to target `/auth/confirm`.
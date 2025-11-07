# Sasta Amazon

This repository now bundles a Supabase-backed ecommerce backend for the game marketplace SPA. The frontend remains a Vite + React + TypeScript single page application using shadcn-ui and Tailwind CSS. All privileged logic runs either inside PostgreSQL (via SQL migrations and Row Level Security) or Supabase Edge Functions so the browser never handles secrets.

## Tech stack

- **Frontend** – Vite SPA (React, TypeScript, shadcn-ui, Tailwind CSS)
- **Database** – Supabase Postgres with `pg_trgm` enabled for fuzzy search
- **Auth** – Supabase Auth (email/password with optional email confirmation)
- **Storage** – Supabase Storage (private `product-images` bucket)
- **Serverless** – Supabase Edge Functions (Deno) for checkout, admin tooling, and storage utilities

## Environment configuration

Create `.env.local` (used by Vite and the Supabase CLI scripts). The following variables are required:

| Variable | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous API key (used in the SPA) |
| `VITE_SUPABASE_EMAIL_REDIRECT_TO` | Optional override for Supabase email confirmations (absolute URL or path) |
| `SUPABASE_SERVICE_ROLE_KEY` | Required when deploying/running Edge Functions locally |
| `SUPABASE_DB_URL` | Postgres connection string used by Edge Functions for transactions (falls back to `DATABASE_URL`) |
| `CHECKOUT_WEBHOOK_SECRET` | Shared secret required when calling the checkout webhook function |

> Tip: keep `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL`, and `CHECKOUT_WEBHOOK_SECRET` in `.env.local` but do **not** expose them to the browser. They are consumed by the Supabase CLI and Edge Functions only.

## Local development workflow

```bash
# Install dependencies
npm install

# Boot Supabase locally (Postgres, Storage, etc.)
npx supabase start

# Apply migrations and seeds from supabase/migrations and supabase/seed/
npm run dev:db:reset

# Run the SPA
npm run dev
```

### Database migrations & seeds

- Migrations live under `supabase/migrations/<timestamp>_*.sql` and can be (re)applied locally using `npm run dev:db:reset`.
- Seeds live in `supabase/seed/seed.sql` and provision:
  - 2 publishers, 3 platforms, 5 categories
  - 12 demo games with stock entries
  - an admin profile (`external_id = admin-dev`) and a demo shopper (`external_id = user-dev`)
- To deploy schema changes to a remote project use:

```bash
npx supabase link --project-ref <your-project-ref>
npm run dev:db:push
```

## Supabase identity mapping & roles

Supabase stores user metadata in `public.profiles`. Every row has a stable `external_id` that matches the Supabase Auth user ID. Database policies compare `profiles.external_id` against `auth.uid()` via the helper function `public.current_user_external_id()`.

To promote an account to admin, update the corresponding profile row:

```sql
insert into public.profiles (external_id, email, display_name, role)
values ('my-supabase-user-id', 'admin@example.com', 'Ops Admin', 'admin')
on conflict (external_id) do update set role = excluded.role;
```

Admin-only mutations (catalog CRUD, inventory management, product uploads) require the caller to carry a JWT whose subject resolves to an admin profile.

## Supabase features implemented

| Feature | Notes |
| --- | --- |
| **Row Level Security** | Enabled across all user-facing tables. Policies rely on Supabase Auth identities via helper functions. |
| **Catalog schema** | Tables for games, publishers, platforms, categories, inventory, carts, orders, order items, reviews, and wishlists with appropriate constraints and indexes (including trigram search on titles). |
| **Storage** | Private `product-images` bucket. Admins (or the service role) can manage content. Clients obtain signed URLs via an Edge Function. |
| **Seeds** | Demo catalog data and baseline profiles in `supabase/seed/seed.sql`. |
| **Edge Functions** | Transactional checkout flow, webhook consumer, admin catalog interface, and storage signing utility. OpenAPI specs sit beside each function. |

## Edge Functions

The Supabase CLI deploys functions by folder path (slashes are translated to hyphenated names by the gateway). Use the helper npm script to deploy all functions:

```bash
npm run deploy:functions
```

Functions overview:

| Invoke name | Source folder | Purpose |
| --- | --- | --- |
| `checkout-create` | `supabase/functions/checkout/create` | Turn the caller's cart into an order within a serializable transaction. |
| `checkout-webhook` | `supabase/functions/checkout/webhook` | Mock webhook to mark orders as paid/failed. Requires `CHECKOUT_WEBHOOK_SECRET`. |
| `catalog-admin` | `supabase/functions/catalog/admin` | Admin-only CRUD for games, publishers, platforms, and categories. |
| `storage-sign-url` | `supabase/functions/storage/sign-url` | Issue short-lived signed URLs for private assets. |

### Invocation examples

Using `@supabase/supabase-js` in the SPA:

```ts
const supabase = getSupabaseClient();
await supabase.functions.invoke('checkout-create', { body: { payment_provider: 'mock-pay' } });
await supabase.functions.invoke('storage-sign-url', { body: { path: 'covers/skyward-vanguard.jpg' } });
```

Using `curl` against a deployed project:

```bash
curl -X POST "https://<project>.functions.supabase.co/checkout/create" \
  -H "Authorization: Bearer $USER_JWT" \
  -H "Content-Type: application/json" \
  -d '{"payment_provider":"mock-pay"}'

curl -X POST "https://<project>.functions.supabase.co/checkout/webhook" \
  -H "x-webhook-secret: $CHECKOUT_WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"order_id":"<uuid>","status":"paid","payment_reference":"stripe_evt_123"}'
```

Each folder under `supabase/functions/**` contains an `openapi.yaml` describing request/response formats.

## SPA data utilities

Typed Supabase helpers live in `src/lib/api/`:

- `supabaseClient.ts` – singleton factory for `SupabaseClient`
- `catalog.ts` – list/search games, fetch a game by slug, request signed storage URLs
- `cart.ts` – create carts, add/update/remove items, clear carts
- `orders.ts` – invoke checkout and read past orders
- `account.ts` – load/update the current profile
- `auth.ts` – decode JWTs and detect admin claims
- `types.ts` – shared TypeScript models for the API layer

## Storage usage

Product and marketing assets belong in the private `product-images` bucket. Admins can upload or delete files through the Supabase dashboard or via the admin Edge Function. The SPA must request signed URLs via `storage-sign-url` before displaying assets.

## Continuous integration

Pull requests automatically validate migrations via GitHub Actions. The workflow spins up Supabase locally, applies migrations, seeds the database, and runs a smoke SQL query to ensure the catalog is reachable.

## Handy scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run lint` | Lint the codebase |
| `npm run dev:db:reset` | Reset the local Supabase instance with the latest migrations + seeds |
| `npm run dev:db:push` | Push migrations to the linked remote project |
| `npm run deploy:functions` | Deploy all Edge Functions |

## Additional references

- [Supabase CLI docs](https://supabase.com/docs/reference/cli) for linking, pushing, and managing functions

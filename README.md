# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/456ffb1c-c238-4c26-a1e8-3f87adad4ad5

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/456ffb1c-c238-4c26-a1e8-3f87adad4ad5) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Connecting Supabase & OpenAuth

This project now persists data in Supabase and delegates authentication to [Supabase OpenAuth](https://supabase.com/docs/guides/openauth).

1. Copy `.env.example` to `.env.local` (or `.env`) and provide the credentials for your Supabase project:

   ```sh
   cp .env.example .env.local
   ```

   | Variable | Description |
   | --- | --- |
   | `VITE_SUPABASE_URL` | Supabase project URL |
   | `VITE_SUPABASE_ANON_KEY` | Anonymous API key |
   | `VITE_OPENAUTH_ISSUER` | OpenAuth issuer URL from the Supabase dashboard |
   | `VITE_OPENAUTH_CLIENT_ID` | The client ID created for this web application |
   | `VITE_OPENAUTH_REDIRECT_URI` | (Optional) override for the callback route, defaults to `/auth/callback` |

2. In Supabase, create the tables used by the app:

   ```sql
   -- Stores profile metadata for authenticated users
   create table if not exists public.profiles (
     id text primary key,
     email text,
     display_name text,
     avatar_color text,
     bio text,
     privacy text default 'friends',
     updated_at timestamptz default now()
   );

   -- Stores the full tracker snapshot per user
   create table if not exists public.tracker_snapshots (
     user_id text primary key references public.profiles(id) on delete cascade,
     snapshot jsonb not null,
     updated_at timestamptz default now()
   );
   ```

3. Enable OpenAuth in Supabase and configure at least one provider (email, Google, GitHub, etc.). Use the callback URL `http://localhost:5173/auth/callback` (or the URL defined in `VITE_OPENAUTH_REDIRECT_URI`).

Once the environment variables are set the app will automatically use Supabase for persistence; without them it falls back to the local demo mode.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/456ffb1c-c238-4c26-a1e8-3f87adad4ad5) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

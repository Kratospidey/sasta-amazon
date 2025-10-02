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

## Connecting Supabase & Authelia

This project now persists data in Supabase and delegates authentication to [Authelia](https://www.authelia.com/) via its OpenID Connect provider. Authelia must be served over HTTPS and your reverse proxy has to forward the headers required by Authelia before the application will accept authenticated sessions.

1. Copy `.env.example` to `.env.local` (or `.env`) and provide the credentials for your Supabase project and Authelia deployment. The example file is pre-populated with the Supabase project shared for this app:

   ```sh
   cp .env.example .env.local
   ```

   | Variable | Description |
   | --- | --- |
   | `VITE_SUPABASE_URL` | Supabase project URL |
   | `VITE_SUPABASE_ANON_KEY` | Anonymous API key |
   | `VITE_AUTHELIA_ISSUER` | Base URL of your Authelia OIDC issuer (e.g. `https://auth.example.com`) |
   | `VITE_AUTHELIA_CLIENT_ID` | OIDC client ID registered in Authelia for this SPA |
   | `VITE_AUTHELIA_REDIRECT_URI` | (Optional) override for the callback route, defaults to `/auth/callback` |
   | `VITE_AUTHELIA_SCOPE` | (Optional) scopes requested from Authelia, defaults to `openid profile email` |

2. Apply the database schema using the Supabase CLI so the `profiles` and `tracker_snapshots` tables are created. The repository already contains a migration in `supabase/migrations`:

   ```sh
   # Ensure dependencies are installed
   npm install

   # Create or update the local Supabase containers
   npx supabase start

   # Apply the migrations defined in supabase/migrations
   npx supabase db reset
   ```

   Running against a remote project? Set your database connection with `npx supabase link` and then run `npx supabase db push`.

3. Configure an OAuth 2.0 client in Authelia that matches the redirect URI above. When users click “Continue with Authelia” they’ll be redirected to Authelia for login and then returned to `/auth/callback`.

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

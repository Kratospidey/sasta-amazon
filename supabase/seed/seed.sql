-- Seed data for the Sasta Amazon game store reference environment.

-- Provision baseline profiles for local testing (maps to Supabase Auth user IDs admin-dev / user-dev).
insert into public.profiles (external_id, email, display_name, role)
values
  ('admin-dev', 'admin@example.com', 'Admin Dev', 'admin'),
  ('user-dev', 'user@example.com', 'Demo User', 'user')
on conflict (external_id) do update set
  email = excluded.email,
  display_name = excluded.display_name,
  role = excluded.role;

-- Catalog fixtures.
insert into public.publishers (name)
values
  ('Nova Forge Studios'),
  ('Pixel Horizon Collective')
on conflict (name) do nothing;

insert into public.platforms (name)
values
  ('PC'),
  ('PlayBox'),
  ('Switchly')
on conflict (name) do nothing;

insert into public.categories (name)
values
  ('Action'),
  ('Adventure'),
  ('RPG'),
  ('Indie'),
  ('Strategy')
on conflict (name) do nothing;

-- Helper CTE to reference publisher IDs when inserting games.
with publisher_map as (
  select id, name from public.publishers where name in ('Nova Forge Studios', 'Pixel Horizon Collective')
)
insert into public.games (title, slug, description, price_in_cents, release_date, publisher_id)
values
  ('Skyward Vanguard', 'skyward-vanguard', 'Lead a squadron of pilots through dynamic aerial battles above a fractured planet.', 5999, '2024-05-20', (select id from publisher_map where name = 'Nova Forge Studios')),
  ('Echoes of Lumen', 'echoes-of-lumen', 'Puzzle adventure that bends light across floating temples to uncover ancient secrets.', 3999, '2023-11-10', (select id from publisher_map where name = 'Pixel Horizon Collective')),
  ('Chronicle Weaver', 'chronicle-weaver', 'Narrative RPG where every choice rewrites history and alters future missions.', 6499, '2024-01-31', (select id from publisher_map where name = 'Nova Forge Studios')),
  ('Starfall Tactics', 'starfall-tactics', 'Command modular fleets and outsmart rivals in a tactical space arena.', 4999, '2023-09-14', (select id from publisher_map where name = 'Pixel Horizon Collective')),
  ('Verdant Vale', 'verdant-vale', 'Cozy farming sim with collaborative world events and whimsical wildlife.', 2999, '2022-12-02', (select id from publisher_map where name = 'Nova Forge Studios')),
  ('Neon Drift Legends', 'neon-drift-legends', 'Arcade racer with roguelite upgrades set in a synthwave metropolis.', 4499, '2023-06-16', (select id from publisher_map where name = 'Pixel Horizon Collective')),
  ('Mystic Siege', 'mystic-siege', 'Hybrid tower defense and deck builder set in a magical kingdom.', 3499, '2022-08-25', (select id from publisher_map where name = 'Nova Forge Studios')),
  ('Quantum Courier', 'quantum-courier', 'Deliver parcels across paradox timelines while evading corporate hunters.', 3799, '2023-03-08', (select id from publisher_map where name = 'Pixel Horizon Collective')),
  ('Underwell Depths', 'underwell-depths', 'Descend into procedurally generated caverns to rescue lost miners.', 2799, '2021-10-01', (select id from publisher_map where name = 'Nova Forge Studios')),
  ('Circuit Bloom', 'circuit-bloom', 'Relaxing automation puzzler with musical feedback loops.', 2499, '2022-04-22', (select id from publisher_map where name = 'Pixel Horizon Collective')),
  ('Riftwalk Arena', 'riftwalk-arena', 'Competitive hero brawler built for cross-platform squads.', 5999, '2024-03-15', (select id from publisher_map where name = 'Nova Forge Studios')),
  ('Lanternwatch', 'lanternwatch', 'Stealth horror adventure navigating haunted canals with dynamic lighting.', 4199, '2023-10-27', (select id from publisher_map where name = 'Pixel Horizon Collective'))
ON CONFLICT (slug) DO UPDATE SET
  title = excluded.title,
  description = excluded.description,
  price_in_cents = excluded.price_in_cents,
  release_date = excluded.release_date,
  publisher_id = excluded.publisher_id;

with platform_pairs as (
  select g.id as game_id, p.id as platform_id
  from (values
    ('skyward-vanguard', 'PC'),
    ('skyward-vanguard', 'PlayBox'),
    ('echoes-of-lumen', 'PC'),
    ('chronicle-weaver', 'PC'),
    ('starfall-tactics', 'PC'),
    ('verdant-vale', 'Switchly'),
    ('neon-drift-legends', 'PlayBox'),
    ('neon-drift-legends', 'PC'),
    ('mystic-siege', 'PC'),
    ('quantum-courier', 'Switchly'),
    ('underwell-depths', 'PC'),
    ('circuit-bloom', 'PC'),
    ('riftwalk-arena', 'PlayBox'),
    ('riftwalk-arena', 'PC'),
    ('lanternwatch', 'PC')
  ) as pairs(slug, platform)
  join public.games g on g.slug = pairs.slug
  join public.platforms p on p.name = pairs.platform
)
insert into public.game_platforms (game_id, platform_id)
select game_id, platform_id from platform_pairs
on conflict (game_id, platform_id) do nothing;

insert into public.game_categories (game_id, category_id)
select g.id, c.id
from public.games g
join public.categories c on c.name in (
  case g.slug
    when 'skyward-vanguard' then 'Action'
    when 'echoes-of-lumen' then 'Adventure'
    when 'chronicle-weaver' then 'RPG'
    when 'starfall-tactics' then 'Strategy'
    when 'verdant-vale' then 'Indie'
    when 'neon-drift-legends' then 'Action'
    when 'mystic-siege' then 'Strategy'
    when 'quantum-courier' then 'Adventure'
    when 'underwell-depths' then 'Action'
    when 'circuit-bloom' then 'Indie'
    when 'riftwalk-arena' then 'Action'
    when 'lanternwatch' then 'Adventure'
  end
)
ON CONFLICT (game_id, category_id) DO NOTHING;

-- Stock levels.
insert into public.inventory (game_id, stock, is_active)
select g.id,
       case g.slug
         when 'skyward-vanguard' then 150
         when 'echoes-of-lumen' then 200
         when 'chronicle-weaver' then 80
         when 'starfall-tactics' then 120
         when 'verdant-vale' then 300
         when 'neon-drift-legends' then 90
         when 'mystic-siege' then 140
         when 'quantum-courier' then 160
         when 'underwell-depths' then 220
         when 'circuit-bloom' then 250
         when 'riftwalk-arena' then 110
         when 'lanternwatch' then 70
         else 50
       end as stock,
       true
from public.games g
ON CONFLICT (game_id) DO UPDATE SET
  stock = excluded.stock,
  is_active = excluded.is_active;

-- Starter reviews for demo user to validate RLS queries.
insert into public.reviews (game_id, user_id, rating, body)
select g.id, p.id, 5, 'An instant favorite for playtests.'
from public.games g
join public.profiles p on p.external_id = 'user-dev'
where g.slug = 'verdant-vale'
ON CONFLICT (game_id, user_id) DO UPDATE SET
  rating = EXCLUDED.rating,
  body = EXCLUDED.body;

-- Ensure demo user has an empty cart for testing.
insert into public.carts (user_id)
select p.id from public.profiles p where p.external_id = 'user-dev'
ON CONFLICT (user_id) DO NOTHING;

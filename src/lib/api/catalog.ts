import { getSupabaseClient } from './supabaseClient';
import type { Category, GameInventorySnapshot, GameSummary, Platform, Publisher } from './types';
import { asNumber, asString, isRecord } from './utils';

export interface GameListFilters {
  search?: string;
  categoryId?: string;
  platformId?: string;
  limit?: number;
}

function mapInventory(input: unknown): GameInventorySnapshot | null {
  if (!input) return null;
  if (Array.isArray(input)) {
    const first = input[0];
    return first ? mapInventory(first) : null;
  }
  if (isRecord(input)) {
    return { stock: asNumber(input.stock, 0), isActive: Boolean(input.is_active ?? input.isActive ?? true) };
  }
  return null;
}

function mapPublisher(input: unknown): Publisher | null {
  if (!isRecord(input)) return null;
  return {
    id: asString(input.id) ?? '',
    name: asString(input.name) ?? '',
    createdAt: asString(input.created_at) ?? new Date().toISOString(),
  };
}

function mapPlatforms(input: unknown): Platform[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => {
      const platform = isRecord(item) ? (isRecord(item.platform) ? item.platform : item) : null;
      if (!isRecord(platform)) return null;
      return {
        id: asString(platform.id) ?? '',
        name: asString(platform.name) ?? '',
        createdAt: asString(platform.created_at) ?? new Date().toISOString(),
      };
    })
    .filter((value): value is Platform => Boolean(value));
}

function mapCategories(input: unknown): Category[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => {
      const category = isRecord(item) ? (isRecord(item.category) ? item.category : item) : null;
      if (!isRecord(category)) return null;
      return {
        id: asString(category.id) ?? '',
        name: asString(category.name) ?? '',
        createdAt: asString(category.created_at) ?? new Date().toISOString(),
      };
    })
    .filter((value): value is Category => Boolean(value));
}

function mapGame(row: unknown): GameSummary {
  if (!isRecord(row)) {
    throw new TypeError('Invalid game payload');
  }
  return {
    id: asString(row.id) ?? '',
    title: asString(row.title) ?? '',
    slug: asString(row.slug) ?? '',
    description: asString(row.description),
    priceInCents: asNumber(row.price_in_cents, 0),
    releaseDate: asString(row.release_date),
    publisherId: asString(row.publisher_id),
    ratingAvg: asNumber(row.rating_avg, 0),
    ratingCount: asNumber(row.rating_count, 0),
    createdAt: asString(row.created_at) ?? new Date().toISOString(),
    inventory: mapInventory(row.inventory),
    publisher: mapPublisher(row.publishers ?? row.publisher),
    platforms: mapPlatforms(row.game_platforms ?? row.platforms),
    categories: mapCategories(row.game_categories ?? row.categories),
  };
}

async function filterGameIds(categoryId?: string, platformId?: string): Promise<string[] | null> {
  const supabase = getSupabaseClient();
  const sets: string[][] = [];

  if (categoryId) {
    const { data, error } = await supabase
      .from('game_categories')
      .select('game_id')
      .eq('category_id', categoryId);
    if (error) throw error;
    sets.push((data ?? []).map((row) => row.game_id));
  }

  if (platformId) {
    const { data, error } = await supabase
      .from('game_platforms')
      .select('game_id')
      .eq('platform_id', platformId);
    if (error) throw error;
    sets.push((data ?? []).map((row) => row.game_id));
  }

  if (sets.length === 0) {
    return null;
  }

  return sets.reduce<string[]>((acc, current) => {
    if (acc.length === 0) return current;
    const currentSet = new Set(current);
    return acc.filter((id) => currentSet.has(id));
  }, sets[0]);
}

export async function listGames(filters: GameListFilters = {}): Promise<GameSummary[]> {
  const supabase = getSupabaseClient();
  const ids = await filterGameIds(filters.categoryId, filters.platformId);

  if (ids && ids.length === 0) {
    return [];
  }

  let query = supabase
    .from('games')
    .select(
      `id, title, slug, description, price_in_cents, release_date, publisher_id, rating_avg, rating_count, created_at,
       inventory:inventory(stock, is_active),
       publishers:publishers(id, name, created_at),
       game_platforms:game_platforms(platform:platforms(id, name, created_at)),
       game_categories:game_categories(category:categories(id, name, created_at))`,
    )
    .order('created_at', { ascending: false });

  if (filters.search) {
    const term = `%${filters.search}%`;
    query = query.or(`title.ilike.${term},slug.ilike.${term}`);
  }

  if (ids) {
    query = query.in('id', ids);
  }

  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(mapGame);
}

export async function getGameBySlug(slug: string): Promise<GameSummary | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('games')
    .select(
      `id, title, slug, description, price_in_cents, release_date, publisher_id, rating_avg, rating_count, created_at,
       inventory:inventory(stock, is_active),
       publishers:publishers(id, name, created_at),
       game_platforms:game_platforms(platform:platforms(id, name, created_at)),
       game_categories:game_categories(category:categories(id, name, created_at))`,
    )
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data ? mapGame(data) : null;
}

export async function getSignedImageUrl(path: string, expiresInSeconds = 300): Promise<string> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.functions.invoke('storage-sign-url', {
    body: { path, expires_in: expiresInSeconds },
  });
  if (error) throw error;
  const payload = (data as { data: { signed_url: string } | null })?.data;
  if (!payload?.signed_url) {
    throw new Error('Signed URL response missing payload');
  }
  return payload.signed_url;
}

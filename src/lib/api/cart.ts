import { getSupabaseClient } from './supabaseClient';
import type { Cart, CartItem } from './types';
import { asNumber, asString, isRecord } from './utils';

function mapCartItem(row: unknown): CartItem {
  if (!isRecord(row)) {
    throw new TypeError('Invalid cart item payload');
  }
  const gameRecord = isRecord(row.game) ? row.game : null;
  return {
    id: asString(row.id) ?? '',
    gameId: asString(row.game_id) ?? '',
    qty: asNumber(row.qty, 0),
    unitPriceInCents: asNumber(row.unit_price_in_cents, 0),
    game: gameRecord
      ? {
          id: asString(gameRecord.id) ?? '',
          title: asString(gameRecord.title) ?? '',
          slug: asString(gameRecord.slug) ?? '',
          priceInCents: asNumber(gameRecord.price_in_cents, 0),
        }
      : undefined,
  };
}

function mapCart(row: unknown): Cart {
  if (!isRecord(row)) {
    throw new TypeError('Invalid cart payload');
  }
  return {
    id: asString(row.id) ?? '',
    createdAt: asString(row.created_at) ?? new Date().toISOString(),
    userId: asString(row.user_id),
    items: Array.isArray(row.cart_items) ? row.cart_items.map(mapCartItem) : [],
  };
}

async function fetchCurrentCart(): Promise<Cart | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('carts')
    .select('id, created_at, user_id, cart_items(id, game_id, qty, unit_price_in_cents, game:games(id, title, slug, price_in_cents))')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error && error.code !== 'PGRST116') throw error;
  return data ? mapCart(data) : null;
}

export async function getCart(): Promise<Cart | null> {
  return await fetchCurrentCart();
}

export async function ensureCart(): Promise<Cart> {
  const existing = await fetchCurrentCart();
  if (existing) return existing;
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('carts')
    .insert({})
    .select('id, created_at, user_id')
    .single();
  if (error) throw error;
  return mapCart({ ...data, cart_items: [] });
}

export async function addOrUpdateItem(gameId: string, qty: number): Promise<Cart> {
  if (qty <= 0) {
    return removeItem(gameId);
  }
  const supabase = getSupabaseClient();
  const cart = await ensureCart();
  const { data: priceData, error: priceError } = await supabase
    .from('games')
    .select('price_in_cents')
    .eq('id', gameId)
    .maybeSingle();
  if (priceError) throw priceError;
  if (!priceData) {
    throw new Error('Game not found');
  }
  const { error } = await supabase.from('cart_items').upsert(
    {
      cart_id: cart.id,
      game_id: gameId,
      qty,
      unit_price_in_cents: priceData.price_in_cents,
    },
    { onConflict: 'cart_id,game_id' },
  );
  if (error) throw error;
  const updated = await fetchCurrentCart();
  if (!updated) throw new Error('Unable to fetch cart after update');
  return updated;
}

export async function removeItem(gameId: string): Promise<Cart> {
  const supabase = getSupabaseClient();
  const cart = await ensureCart();
  const { error } = await supabase.from('cart_items').delete().eq('cart_id', cart.id).eq('game_id', gameId);
  if (error) throw error;
  const updated = await fetchCurrentCart();
  if (!updated) throw new Error('Unable to fetch cart after removal');
  return updated;
}

export async function clearCart(): Promise<void> {
  const supabase = getSupabaseClient();
  const cart = await fetchCurrentCart();
  if (!cart) return;
  const { error } = await supabase.from('cart_items').delete().eq('cart_id', cart.id);
  if (error) throw error;
}

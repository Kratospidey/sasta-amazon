import { getSupabaseClient } from './supabaseClient';
import type { Order, OrderItem, OrderStatus } from './types';
import { asNumber, asString, isRecord } from './utils';

function mapOrderItem(row: unknown): OrderItem {
  if (!isRecord(row)) {
    throw new TypeError('Invalid order item payload');
  }
  const gameRecord = isRecord(row.game) ? row.game : null;
  return {
    id: asString(row.id) ?? '',
    orderId: asString(row.order_id) ?? '',
    gameId: asString(row.game_id) ?? '',
    qty: asNumber(row.qty, 0),
    unitPriceInCents: asNumber(row.unit_price_in_cents, 0),
    game: gameRecord ? { title: asString(gameRecord.title) ?? '', slug: asString(gameRecord.slug) ?? '' } : undefined,
  };
}

function mapOrder(row: unknown): Order {
  if (!isRecord(row)) {
    throw new TypeError('Invalid order payload');
  }
  return {
    id: asString(row.id) ?? '',
    userId: asString(row.user_id) ?? '',
    status: (row.status as OrderStatus) ?? 'pending',
    totalInCents: asNumber(row.total_in_cents, 0),
    paymentRef: asString(row.payment_ref),
    createdAt: asString(row.created_at) ?? new Date().toISOString(),
    items: Array.isArray(row.order_items) ? row.order_items.map(mapOrderItem) : [],
  };
}

export async function startCheckout(
  paymentProvider?: string,
): Promise<{ orderId: string; paymentIntent: string; totalInCents: number; status: OrderStatus }> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.functions.invoke('checkout-create', {
    body: paymentProvider ? { payment_provider: paymentProvider } : {},
  });
  if (error) throw error;
  const typed = data as { data: { order_id: string; payment_intent: string; total_in_cents: number } | null } | null;
  const payload = typed?.data;
  if (!payload) {
    throw new Error('Checkout response missing payload');
  }
  return {
    orderId: payload.order_id,
    paymentIntent: payload.payment_intent,
    totalInCents: payload.total_in_cents,
    status: 'pending',
  };
}

export async function listOrders(): Promise<Order[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id, user_id, status, total_in_cents, payment_ref, created_at,
      order_items(id, order_id, game_id, qty, unit_price_in_cents, game:games(title, slug))
    `)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapOrder);
}

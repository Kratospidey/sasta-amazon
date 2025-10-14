export interface Profile {
  id: string;
  externalId: string;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Publisher {
  id: string;
  name: string;
  createdAt: string;
}

export interface Platform {
  id: string;
  name: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export interface GameInventorySnapshot {
  stock: number;
  isActive: boolean;
}

export interface GameSummary {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  priceInCents: number;
  releaseDate: string | null;
  publisherId: string | null;
  ratingAvg: number;
  ratingCount: number;
  createdAt: string;
  inventory?: GameInventorySnapshot | null;
  publisher?: Publisher | null;
  platforms?: Platform[];
  categories?: Category[];
}

export interface CartItem {
  id: string;
  gameId: string;
  qty: number;
  unitPriceInCents: number;
  game?: Pick<GameSummary, 'id' | 'title' | 'slug' | 'priceInCents'>;
}

export interface Cart {
  id: string;
  createdAt: string;
  userId: string | null;
  items: CartItem[];
}

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled' | 'fulfilled';

export interface OrderItem {
  id: string;
  orderId: string;
  gameId: string;
  qty: number;
  unitPriceInCents: number;
  game?: Pick<GameSummary, 'title' | 'slug'>;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalInCents: number;
  paymentRef: string | null;
  createdAt: string;
  items: OrderItem[];
}

export interface Review {
  id: string;
  gameId: string;
  userId: string;
  rating: number;
  body: string | null;
  createdAt: string;
}

export type Platform = {
  id: string;
  name: string;
};

export type Game = {
  id: string;
  title: string;
  description: string;
  genres: string[];
  platforms: string[];
  releaseDate: string;
  developer: string;
  coverImage: string;
  gallery: string[];
  averagePlaytime: number;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  xp: number;
  rarity: "common" | "uncommon" | "rare" | "legendary";
  category: "library" | "playtime" | "engagement" | "social";
};

export type AchievementUnlock = {
  id: string;
  achievementId: string;
  userId: string;
  unlockedAt: string;
};

export type List = {
  id: string;
  userId: string;
  name: string;
  type: "default" | "custom";
};

export type ListItem = {
  id: string;
  listId: string;
  gameId: string;
  status: "Backlog" | "Playing" | "Completed" | string;
  progress: number;
  playtimeMinutes: number;
  lastPlayedAt: string | null;
  isInstalled: boolean;
};

export type PlaySession = {
  id: string;
  userId: string;
  gameId: string;
  minutes: number;
  playedAt: string;
};

export type ActivityEvent = {
  id: string;
  userId: string;
  type: "achievement" | "list" | "play" | "reminder";
  title: string;
  description: string;
  createdAt: string;
  relatedGameId?: string;
  relatedAchievementId?: string;
  relatedCategory?: Achievement["category"];
};

export type TrackerDataSnapshot = {
  platforms: Platform[];
  games: Game[];
  achievements: Achievement[];
  achievementUnlocks: AchievementUnlock[];
  lists: List[];
  listItems: ListItem[];
  playSessions: PlaySession[];
  activity: ActivityEvent[];
};

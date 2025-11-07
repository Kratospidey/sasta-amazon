import type { ActivityEvent, TrackerDataSnapshot } from "./trackerTypes";

/**
 * Achievements that the tracker can unlock automatically.
 * Consumers can use this list to adjust UI affordances.
 */
export const AUTOMATED_ACHIEVEMENT_IDS = new Set<
  | "first-library-entry"
  | "five-games-tracked"
  | "ten-games-tracked"
  | "first-play-session"
  | "fifty-hours-played"
  | "hundred-hours-played"
  | "weekly-check-in"
>([
  "first-library-entry",
  "five-games-tracked",
  "ten-games-tracked",
  "first-play-session",
  "fifty-hours-played",
  "hundred-hours-played",
  "weekly-check-in",
]);

const MINUTES_PER_HOUR = 60;
const DAY_IN_MS = 86_400_000;

const startOfDay = (value: Date) => {
  const clone = new Date(value);
  clone.setUTCHours(0, 0, 0, 0);
  return clone;
};

const hasSevenDayStreak = (events: ActivityEvent[]) => {
  if (!events.length) return false;

  const uniqueDays = new Set(
    events
      .map((event) => {
        const timestamp = new Date(event.createdAt);
        return Number.isNaN(timestamp.getTime()) ? null : startOfDay(timestamp).getTime();
      })
      .filter((value): value is number => value !== null),
  );

  const sorted = Array.from(uniqueDays).sort((a, b) => a - b);
  for (let i = 0; i < sorted.length; i += 1) {
    let streak = 1;
    let last = sorted[i];
    for (let j = i + 1; j < sorted.length; j += 1) {
      const current = sorted[j];
      if (current - last === DAY_IN_MS) {
        streak += 1;
        last = current;
        if (streak >= 7) {
          return true;
        }
      } else if (current - last > DAY_IN_MS) {
        break;
      }
    }
  }

  return false;
};

const countTrackedGames = (snapshot: TrackerDataSnapshot, userId: string) => {
  const listById = new Map(snapshot.lists.map((list) => [list.id, list] as const));
  const ownedItems = snapshot.listItems.filter((item) => listById.get(item.listId)?.userId === userId);
  return new Set(ownedItems.map((item) => item.gameId)).size;
};

const totalPlaytimeMinutes = (snapshot: TrackerDataSnapshot, userId: string) => {
  const listById = new Map(snapshot.lists.map((list) => [list.id, list] as const));
  return snapshot.listItems
    .filter((item) => listById.get(item.listId)?.userId === userId)
    .reduce((sum, item) => sum + item.playtimeMinutes, 0);
};

const hasPlaySessions = (snapshot: TrackerDataSnapshot, userId: string) =>
  snapshot.playSessions.some((session) => session.userId === userId);

const hasWeeklyCheckIn = (snapshot: TrackerDataSnapshot, userId: string) =>
  hasSevenDayStreak(snapshot.activity.filter((event) => event.userId === userId));

type Rule = (snapshot: TrackerDataSnapshot, userId: string) => boolean;

const RULES: Record<string, Rule> = {
  "first-library-entry": (snapshot, userId) => countTrackedGames(snapshot, userId) >= 1,
  "five-games-tracked": (snapshot, userId) => countTrackedGames(snapshot, userId) >= 5,
  "ten-games-tracked": (snapshot, userId) => countTrackedGames(snapshot, userId) >= 10,
  "first-play-session": hasPlaySessions,
  "fifty-hours-played": (snapshot, userId) => totalPlaytimeMinutes(snapshot, userId) >= 50 * MINUTES_PER_HOUR,
  "hundred-hours-played": (snapshot, userId) => totalPlaytimeMinutes(snapshot, userId) >= 100 * MINUTES_PER_HOUR,
  "weekly-check-in": hasWeeklyCheckIn,
};

const getExistingUnlocks = (snapshot: TrackerDataSnapshot, userId: string) =>
  new Set(
    snapshot.achievementUnlocks
      .filter((unlock) => unlock.userId === userId)
      .map((unlock) => unlock.achievementId),
  );

type AutomatedAchievementId = typeof AUTOMATED_ACHIEVEMENT_IDS extends Set<infer U> ? U : never;

export const isAutomaticallyTrackedAchievement = (id: string): id is AutomatedAchievementId =>
  AUTOMATED_ACHIEVEMENT_IDS.has(id as AutomatedAchievementId);

/**
 * Determine which automated achievements should unlock for the provided user.
 */
export const evaluateAutomaticAchievements = (
  snapshot: TrackerDataSnapshot,
  userId: string,
): string[] => {
  if (!userId) return [];

  const available = new Set(snapshot.achievements.map((achievement) => achievement.id));
  const unlocked = getExistingUnlocks(snapshot, userId);

  return Array.from(AUTOMATED_ACHIEVEMENT_IDS)
    .filter((achievementId) => available.has(achievementId) && !unlocked.has(achievementId))
    .filter((achievementId) => RULES[achievementId]?.(snapshot, userId));
};

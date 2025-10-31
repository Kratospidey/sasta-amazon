import { describe, expect, it } from "vitest";
import { evaluateAutomaticAchievements } from "./achievementRules";
import type { TrackerDataSnapshot, Achievement, ListItem, ActivityEvent } from "./trackerTypes";

const automatedAchievements: Achievement[] = [
  {
    id: "first-library-entry",
    name: "First Entry",
    description: "Add your first game",
    xp: 10,
    rarity: "common",
    category: "library",
  },
  {
    id: "five-games-tracked",
    name: "Collector",
    description: "Track five games",
    xp: 20,
    rarity: "uncommon",
    category: "library",
  },
  {
    id: "ten-games-tracked",
    name: "Curator",
    description: "Track ten games",
    xp: 30,
    rarity: "rare",
    category: "library",
  },
  {
    id: "first-play-session",
    name: "Warm Up",
    description: "Log a session",
    xp: 15,
    rarity: "common",
    category: "playtime",
  },
  {
    id: "fifty-hours-played",
    name: "Weekend Warrior",
    description: "Play 50 hours",
    xp: 35,
    rarity: "uncommon",
    category: "playtime",
  },
  {
    id: "hundred-hours-played",
    name: "Marathon",
    description: "Play 100 hours",
    xp: 55,
    rarity: "legendary",
    category: "playtime",
  },
  {
    id: "weekly-check-in",
    name: "Habit Builder",
    description: "Activity streak",
    xp: 25,
    rarity: "rare",
    category: "engagement",
  },
];

const baseSnapshot: TrackerDataSnapshot = {
  achievements: automatedAchievements,
  achievementUnlocks: [],
  activity: [],
  games: [],
  listItems: [],
  lists: [],
  platforms: [],
  playSessions: [],
};

const makeListItem = (overrides: Partial<ListItem>): ListItem => ({
  id: overrides.id ?? "item", 
  listId: overrides.listId ?? "list",
  gameId: overrides.gameId ?? "game",
  status: overrides.status ?? "Backlog",
  progress: overrides.progress ?? 0,
  playtimeMinutes: overrides.playtimeMinutes ?? 0,
  lastPlayedAt: overrides.lastPlayedAt ?? null,
  isInstalled: overrides.isInstalled ?? false,
});

const makeActivity = (overrides: Partial<ActivityEvent>): ActivityEvent => ({
  id: overrides.id ?? "activity",
  userId: overrides.userId ?? "user-1",
  type: overrides.type ?? "list",
  title: overrides.title ?? "Event",
  description: overrides.description ?? "",
  createdAt: overrides.createdAt ?? new Date().toISOString(),
});

describe("evaluateAutomaticAchievements", () => {
  it("unlocks library milestones based on tracked games", () => {
    const snapshot: TrackerDataSnapshot = {
      ...baseSnapshot,
      lists: [
        { id: "list", userId: "user-1", name: "Backlog", type: "default" },
      ],
      listItems: [],
    };

    expect(evaluateAutomaticAchievements(snapshot, "user-1")).toEqual([]);

    const oneGame = {
      ...snapshot,
      listItems: [makeListItem({ id: "item-1" })],
    };

    expect(evaluateAutomaticAchievements(oneGame, "user-1")).toContain("first-library-entry");

    const fiveGames = {
      ...oneGame,
      listItems: Array.from({ length: 5 }, (_, index) =>
        makeListItem({ id: `item-${index}`, gameId: `game-${index}` }),
      ),
    };

    const unlockedAtFive = evaluateAutomaticAchievements(fiveGames, "user-1");
    expect(unlockedAtFive).toContain("five-games-tracked");

    const tenGames = {
      ...fiveGames,
      listItems: Array.from({ length: 10 }, (_, index) =>
        makeListItem({ id: `item-${index}`, gameId: `game-${index}` }),
      ),
    };

    const unlockedAtTen = evaluateAutomaticAchievements(tenGames, "user-1");
    expect(unlockedAtTen).toContain("ten-games-tracked");
  });

  it("only considers data owned by the requested user", () => {
    const snapshot: TrackerDataSnapshot = {
      ...baseSnapshot,
      lists: [
        { id: "list-a", userId: "user-1", name: "Backlog", type: "default" },
        { id: "list-b", userId: "user-2", name: "Backlog", type: "default" },
      ],
      listItems: [
        makeListItem({ id: "item-a", listId: "list-a", gameId: "game-a" }),
        makeListItem({ id: "item-b", listId: "list-b", gameId: "game-b" }),
      ],
    };

    expect(evaluateAutomaticAchievements(snapshot, "user-1")).toContain("first-library-entry");
    expect(evaluateAutomaticAchievements(snapshot, "user-2")).toContain("first-library-entry");
  });

  it("detects playtime and session achievements", () => {
    const snapshot: TrackerDataSnapshot = {
      ...baseSnapshot,
      lists: [{ id: "list", userId: "user-1", name: "Backlog", type: "default" }],
      listItems: [
        makeListItem({ id: "item-1", playtimeMinutes: 3_000 }),
      ],
      playSessions: [
        { id: "session-1", userId: "user-1", gameId: "game-1", minutes: 60, playedAt: new Date().toISOString() },
      ],
    };

    const unlocked = evaluateAutomaticAchievements(snapshot, "user-1");
    expect(unlocked).toEqual(
      expect.arrayContaining([
        "first-play-session",
        "fifty-hours-played",
      ]),
    );

    const marathonSnapshot = {
      ...snapshot,
      listItems: [makeListItem({ id: "item-1", playtimeMinutes: 6_200 })],
    };

    expect(evaluateAutomaticAchievements(marathonSnapshot, "user-1")).toContain("hundred-hours-played");
  });

  it("requires seven consecutive days of activity for weekly check-in", () => {
    const baseDate = new Date("2024-01-08T12:00:00.000Z");
    const streakEvents: ActivityEvent[] = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(baseDate.getTime() + index * 86_400_000);
      return makeActivity({ id: `activity-${index}`, createdAt: day.toISOString() });
    });

    const snapshot: TrackerDataSnapshot = {
      ...baseSnapshot,
      activity: streakEvents,
    };

    expect(evaluateAutomaticAchievements(snapshot, "user-1")).toContain("weekly-check-in");

    const brokenStreak: TrackerDataSnapshot = {
      ...snapshot,
      activity: streakEvents.filter((_, index) => index !== 3),
    };

    expect(evaluateAutomaticAchievements(brokenStreak, "user-1")).not.toContain("weekly-check-in");
  });

  it("ignores achievements that are already unlocked", () => {
    const snapshot: TrackerDataSnapshot = {
      ...baseSnapshot,
      lists: [{ id: "list", userId: "user-1", name: "Backlog", type: "default" }],
      listItems: [makeListItem({ id: "item-1" })],
      achievementUnlocks: [
        { id: "unlock-1", userId: "user-1", achievementId: "first-library-entry", unlockedAt: new Date().toISOString() },
      ],
    };

    expect(evaluateAutomaticAchievements(snapshot, "user-1")).not.toContain("first-library-entry");
  });
});

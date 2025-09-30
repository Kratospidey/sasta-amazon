import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  ActivityEvent,
  Achievement,
  AchievementUnlock,
  Game,
  List,
  ListItem,
  PlaySession,
  Platform,
  TrackerDataSnapshot,
} from "@/lib/trackerTypes";
import { defaultTrackerData } from "@/lib/seeds";

const STORAGE_KEY = "gamevault-tracker-data";

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Math.random().toString(36).slice(2, 11)}`;

export type TrackerContextValue = {
  data: TrackerDataSnapshot;
  games: Game[];
  platforms: Platform[];
  achievements: Achievement[];
  lists: List[];
  listItems: ListItem[];
  achievementUnlocks: AchievementUnlock[];
  activity: ActivityEvent[];
  playSessions: PlaySession[];
  refresh: () => void;
  createList: (input: { userId: string; name: string }) => string;
  addGameToList: (input: { listId: string; gameId: string; status?: string }) => void;
  updateListItem: (id: string, updates: Partial<ListItem>) => void;
  moveToList: (input: { itemId: string; targetListId: string; status?: string }) => void;
  logPlaySession: (input: { userId: string; gameId: string; minutes: number }) => void;
  unlockAchievement: (input: { userId: string; achievementId: string }) => void;
  recordActivity: (event: ActivityEvent) => void;
  deleteList: (listId: string) => void;
};

const TrackerContext = createContext<TrackerContextValue | undefined>(undefined);

const loadData = (): TrackerDataSnapshot => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTrackerData));
    return defaultTrackerData;
  }

  try {
    const parsed = JSON.parse(raw) as TrackerDataSnapshot;
    return {
      ...defaultTrackerData,
      ...parsed,
      platforms: parsed.platforms?.length ? parsed.platforms : defaultTrackerData.platforms,
      games: parsed.games?.length ? parsed.games : defaultTrackerData.games,
    };
  } catch (error) {
    console.error("Failed to parse tracker data", error);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTrackerData));
    return defaultTrackerData;
  }
};

const persistData = (data: TrackerDataSnapshot) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const TrackerProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<TrackerDataSnapshot>(defaultTrackerData);

  useEffect(() => {
    setData(loadData());
  }, []);

  const updateData = useCallback((updater: (snapshot: TrackerDataSnapshot) => TrackerDataSnapshot) => {
    setData((prev) => {
      const next = updater(prev);
      persistData(next);
      return next;
    });
  }, []);

  const refresh = useCallback(() => {
    setData(loadData());
  }, []);

  const createList = useCallback<TrackerContextValue["createList"]>(({ userId, name }) => {
    const id = `list-${createId()}`;
    updateData((snapshot) => ({
      ...snapshot,
      lists: [...snapshot.lists, { id, userId, name, type: "custom" }],
    }));
    return id;
  }, [updateData]);

  const addGameToList = useCallback<TrackerContextValue["addGameToList"]>(({ listId, gameId, status }) => {
    updateData((snapshot) => {
      const existing = snapshot.listItems.find((item) => item.listId === listId && item.gameId === gameId);
      if (existing) {
        return {
          ...snapshot,
          listItems: snapshot.listItems.map((item) =>
            item.id === existing.id ? { ...item, status: status ?? item.status } : item,
          ),
        };
      }

      const newItem: ListItem = {
        id: `item-${createId()}`,
        listId,
        gameId,
        status: status ?? "Backlog",
        progress: 0,
        playtimeMinutes: 0,
        lastPlayedAt: null,
        isInstalled: false,
      };

      return {
        ...snapshot,
        listItems: [...snapshot.listItems, newItem],
        activity: [
          {
            id: `activity-${createId()}`,
            userId: snapshot.lists.find((list) => list.id === listId)?.userId ?? "",
            type: "list",
            title: `Added ${snapshot.games.find((g) => g.id === gameId)?.title ?? "a game"} to list`,
            description: "Game catalog updated.",
            createdAt: new Date().toISOString(),
            relatedGameId: gameId,
          },
          ...snapshot.activity,
        ].slice(0, 40),
      };
    });
  }, [updateData]);

  const updateListItem = useCallback<TrackerContextValue["updateListItem"]>((id, updates) => {
    updateData((snapshot) => ({
      ...snapshot,
      listItems: snapshot.listItems.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
            }
          : item,
      ),
    }));
  }, [updateData]);

  const moveToList = useCallback<TrackerContextValue["moveToList"]>(({ itemId, targetListId, status }) => {
    updateData((snapshot) => ({
      ...snapshot,
      listItems: snapshot.listItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              listId: targetListId,
              status: status ?? item.status,
            }
          : item,
      ),
      activity: [
        {
          id: `activity-${createId()}`,
          userId: snapshot.lists.find((list) => list.id === targetListId)?.userId ?? "",
          type: "list",
          title: `Moved ${snapshot.games.find((g) => g.id === snapshot.listItems.find((li) => li.id === itemId)?.gameId)?.title ?? "a game"}`,
          description: "List organisation updated.",
          createdAt: new Date().toISOString(),
          relatedGameId: snapshot.listItems.find((li) => li.id === itemId)?.gameId,
        },
        ...snapshot.activity,
      ].slice(0, 40),
    }));
  }, [updateData]);

  const logPlaySession = useCallback<TrackerContextValue["logPlaySession"]>(({ userId, gameId, minutes }) => {
    const now = new Date().toISOString();
    updateData((snapshot) => {
      const item = snapshot.listItems.find((li) => li.gameId === gameId && snapshot.lists.find((l) => l.id === li.listId)?.userId === userId);
      return {
        ...snapshot,
        listItems: snapshot.listItems.map((li) =>
          li.id === item?.id
            ? {
                ...li,
                playtimeMinutes: li.playtimeMinutes + minutes,
                progress: Math.min(1, li.progress + minutes / (snapshot.games.find((g) => g.id === gameId)?.averagePlaytime || 600)),
                lastPlayedAt: now,
              }
            : li,
        ),
        playSessions: [
          {
            id: `session-${createId()}`,
            userId,
            gameId,
            minutes,
            playedAt: now,
          },
          ...snapshot.playSessions,
        ].slice(0, 60),
        activity: [
          {
            id: `activity-${createId()}`,
            userId,
            type: "play",
            title: `Logged ${minutes} minutes in ${snapshot.games.find((g) => g.id === gameId)?.title ?? "a game"}`,
            description: "Play session recorded.",
            createdAt: now,
            relatedGameId: gameId,
          },
          ...snapshot.activity,
        ].slice(0, 40),
      };
    });
  }, [updateData]);

  const unlockAchievement = useCallback<TrackerContextValue["unlockAchievement"]>(({ userId, achievementId }) => {
    const now = new Date().toISOString();
    updateData((snapshot) => {
      if (snapshot.achievementUnlocks.some((unlock) => unlock.userId === userId && unlock.achievementId === achievementId)) {
        return snapshot;
      }
      const achievement = snapshot.achievements.find((ach) => ach.id === achievementId);
      return {
        ...snapshot,
        achievementUnlocks: [
          {
            id: `unlock-${createId()}`,
            userId,
            achievementId,
            unlockedAt: now,
          },
          ...snapshot.achievementUnlocks,
        ],
        activity: [
          {
            id: `activity-${createId()}`,
            userId,
            type: "achievement",
            title: `Unlocked ${achievement?.name ?? "an achievement"}`,
            description: achievement?.description ?? "Achievement unlocked",
            createdAt: now,
            relatedGameId: achievement?.gameId,
            relatedAchievementId: achievementId,
          },
          ...snapshot.activity,
        ].slice(0, 40),
      };
    });
  }, [updateData]);

  const recordActivity = useCallback<TrackerContextValue["recordActivity"]>((event) => {
    updateData((snapshot) => ({
      ...snapshot,
      activity: [event, ...snapshot.activity].slice(0, 40),
    }));
  }, [updateData]);

  const deleteList = useCallback<TrackerContextValue["deleteList"]>((listId) => {
    updateData((snapshot) => ({
      ...snapshot,
      lists: snapshot.lists.filter((list) => list.id !== listId || list.type === "default"),
      listItems: snapshot.listItems.filter((item) => item.listId !== listId),
    }));
  }, [updateData]);

  const value = useMemo<TrackerContextValue>(() => ({
    data,
    games: data.games,
    platforms: data.platforms,
    achievements: data.achievements,
    lists: data.lists,
    listItems: data.listItems,
    achievementUnlocks: data.achievementUnlocks,
    activity: data.activity,
    playSessions: data.playSessions,
    refresh,
    createList,
    addGameToList,
    updateListItem,
    moveToList,
    logPlaySession,
    unlockAchievement,
    recordActivity,
    deleteList,
  }), [data, refresh, createList, addGameToList, updateListItem, moveToList, logPlaySession, unlockAchievement, recordActivity, deleteList]);

  return <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>;
};

export const useTracker = () => {
  const ctx = useContext(TrackerContext);
  if (!ctx) {
    throw new Error("useTracker must be used within a TrackerProvider");
  }
  return ctx;
};

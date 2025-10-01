import eldenRingCover from "@/assets/elden-ring-cover.png";
import eldenRingScreenshot1 from "@/assets/elden-ring-screenshot-1.png";
import eldenRingScreenshot2 from "@/assets/elden-ring-screenshot-2.png";
import eldenRingScreenshot3 from "@/assets/elden-ring-screenshot-3.png";
import cyberpunkCover from "@/assets/cyberpunk-cover.png";
import cyberpunkScreenshot1 from "@/assets/cyberpunk-screenshot-1.png";
import cyberpunkScreenshot2 from "@/assets/cyberpunk-screenshot-2.png";
import cyberpunkScreenshot3 from "@/assets/cyberpunk-screenshot-3.png";
import stardewValleyCover from "@/assets/stardew-valley-cover.png";
import stardewValleyScreenshot1 from "@/assets/stardew-valley-screenshot-1.png";
import stardewValleyScreenshot2 from "@/assets/stardew-valley-screenshot-2.png";
import stardewValleyScreenshot3 from "@/assets/stardew-valley-screenshot-3.png";
import apexLegendsCover from "@/assets/apex-legends-cover.png";
import apexLegendsScreenshot1 from "@/assets/apex-legends-screenshot-1.png";
import apexLegendsScreenshot2 from "@/assets/apex-legends-screenshot-2.png";
import apexLegendsScreenshot3 from "@/assets/apex-legends-screenshot-3.png";
import rocketLeagueCover from "@/assets/rocket-league-cover.png";
import rocketLeagueScreenshot1 from "@/assets/rocket-league-screenshot-1.png";
import rocketLeagueScreenshot2 from "@/assets/rocket-league-screenshot-2.png";
import rocketLeagueScreenshot3 from "@/assets/rocket-league-screenshot-3.png";
import amongUsCover from "@/assets/among-us-cover.png";
import amongUsScreenshot1 from "@/assets/among-us-screenshot-1.png";
import amongUsScreenshot2 from "@/assets/among-us-screenshot-2.png";
import amongUsScreenshot3 from "@/assets/among-us-screenshot-3.png";
import { TrackerDataSnapshot } from "./trackerTypes";

const now = new Date();
const iso = (date: Date) => date.toISOString();

export const defaultTrackerData: TrackerDataSnapshot = {
  platforms: [
    { id: "pc", name: "PC" },
    { id: "ps5", name: "PlayStation 5" },
    { id: "xbox", name: "Xbox Series" },
    { id: "switch", name: "Nintendo Switch" },
  ],
  games: [
    {
      id: "elden-ring",
      title: "Elden Ring",
      description:
        "Venture into the Lands Between in FromSoftware's acclaimed action RPG. Forge your own path across sprawling open zones, conquer imposing legacy dungeons, and experiment with deep character builds.",
      genres: ["Action RPG", "Open World"],
      platforms: ["pc", "ps5", "xbox"],
      releaseDate: "2022-02-25",
      developer: "FromSoftware",
      coverImage: eldenRingCover,
      gallery: [eldenRingScreenshot1, eldenRingScreenshot2, eldenRingScreenshot3],
      averagePlaytime: 7200,
    },
    {
      id: "cyberpunk-2077",
      title: "Cyberpunk 2077",
      description:
        "Experience Night City as V, a mercenary outlaw chasing immortality. Upgrade cyberware, make high-stakes choices, and explore a neon metropolis brought to life by CD Projekt Red.",
      genres: ["RPG", "Shooter"],
      platforms: ["pc", "ps5", "xbox"],
      releaseDate: "2020-12-10",
      developer: "CD Projekt Red",
      coverImage: cyberpunkCover,
      gallery: [cyberpunkScreenshot1, cyberpunkScreenshot2, cyberpunkScreenshot3],
      averagePlaytime: 4800,
    },
    {
      id: "stardew-valley",
      title: "Stardew Valley",
      description:
        "Move to the countryside, restore your grandfather's farm, and build relationships with the people of Pelican Town in this beloved farming life sim from ConcernedApe.",
      genres: ["Simulation", "Indie"],
      platforms: ["pc", "switch"],
      releaseDate: "2016-02-26",
      developer: "ConcernedApe",
      coverImage: stardewValleyCover,
      gallery: [stardewValleyScreenshot1, stardewValleyScreenshot2, stardewValleyScreenshot3],
      averagePlaytime: 5400,
    },
    {
      id: "apex-legends",
      title: "Apex Legends",
      description:
        "Drop into the Apex Games, a free-to-play hero shooter where unique Legends team up for strategic battle royale matches with fluid movement and squad-based abilities.",
      genres: ["Shooter", "Battle Royale"],
      platforms: ["pc", "ps5", "xbox"],
      releaseDate: "2019-02-04",
      developer: "Respawn Entertainment",
      coverImage: apexLegendsCover,
      gallery: [apexLegendsScreenshot1, apexLegendsScreenshot2, apexLegendsScreenshot3],
      averagePlaytime: 2700,
    },
    {
      id: "rocket-league",
      title: "Rocket League",
      description:
        "High-powered hybrid of arcade-style soccer and vehicular mayhem. Master aerial shots, compete in ranked playlists, and chase seasonal rewards with your customised ride.",
      genres: ["Sports", "Action"],
      platforms: ["pc", "ps5", "xbox", "switch"],
      releaseDate: "2015-07-07",
      developer: "Psyonix",
      coverImage: rocketLeagueCover,
      gallery: [rocketLeagueScreenshot1, rocketLeagueScreenshot2, rocketLeagueScreenshot3],
      averagePlaytime: 2100,
    },
    {
      id: "among-us",
      title: "Among Us",
      description:
        "Work together to keep your spaceship running—but beware the Impostor among the crew. Complete tasks, discuss suspicions, and vote wisely in this social deduction hit.",
      genres: ["Party", "Social Deduction"],
      platforms: ["pc", "switch"],
      releaseDate: "2018-11-16",
      developer: "Innersloth",
      coverImage: amongUsCover,
      gallery: [amongUsScreenshot1, amongUsScreenshot2, amongUsScreenshot3],
      averagePlaytime: 1200,
    },
  ],
  achievements: [
    {
      id: "first-library-entry",
      name: "First Entry",
      description: "Add your first game to any list in your library.",
      xp: 10,
      rarity: "common",
      category: "library",
    },
    {
      id: "five-games-tracked",
      name: "Collector in Training",
      description: "Track five different games across your lists.",
      xp: 20,
      rarity: "uncommon",
      category: "library",
    },
    {
      id: "ten-games-tracked",
      name: "Curator Supreme",
      description: "Track ten games in your library.",
      xp: 40,
      rarity: "rare",
      category: "library",
    },
    {
      id: "first-play-session",
      name: "Warm Up",
      description: "Log your first play session with GameVault.",
      xp: 15,
      rarity: "common",
      category: "playtime",
    },
    {
      id: "fifty-hours-played",
      name: "Weekend Warrior",
      description: "Accumulate 50 hours of tracked playtime.",
      xp: 35,
      rarity: "uncommon",
      category: "playtime",
    },
    {
      id: "hundred-hours-played",
      name: "Marathon Runner",
      description: "Log 100 hours of playtime across all games.",
      xp: 60,
      rarity: "legendary",
      category: "playtime",
    },
    {
      id: "weekly-check-in",
      name: "Habit Builder",
      description: "Record activity on seven consecutive days.",
      xp: 25,
      rarity: "rare",
      category: "engagement",
    },
    {
      id: "share-profile",
      name: "Social Spark",
      description: "Make your profile public and share it at least once.",
      xp: 20,
      rarity: "uncommon",
      category: "social",
    },
  ],
  achievementUnlocks: [
    {
      id: "unlock-1",
      achievementId: "first-library-entry",
      userId: "demo-user",
      unlockedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 14)),
    },
    {
      id: "unlock-2",
      achievementId: "first-play-session",
      userId: "demo-user",
      unlockedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 6)),
    },
    {
      id: "unlock-3",
      achievementId: "fifty-hours-played",
      userId: "demo-user",
      unlockedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 12)),
    },
  ],
  lists: [
    { id: "list-backlog", userId: "demo-user", name: "Backlog", type: "default" },
    { id: "list-playing", userId: "demo-user", name: "Playing", type: "default" },
    { id: "list-completed", userId: "demo-user", name: "Completed", type: "default" },
    { id: "list-coop", userId: "demo-user", name: "Co-op Nights", type: "custom" },
  ],
  listItems: [
    {
      id: "item-1",
      listId: "list-playing",
      gameId: "elden-ring",
      status: "Playing",
      progress: 0.52,
      playtimeMinutes: 1560,
      lastPlayedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 18)),
      isInstalled: true,
    },
    {
      id: "item-2",
      listId: "list-backlog",
      gameId: "cyberpunk-2077",
      status: "Backlog",
      progress: 0.08,
      playtimeMinutes: 240,
      lastPlayedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 48)),
      isInstalled: false,
    },
    {
      id: "item-3",
      listId: "list-completed",
      gameId: "stardew-valley",
      status: "Completed",
      progress: 1,
      playtimeMinutes: 4320,
      lastPlayedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10)),
      isInstalled: false,
    },
    {
      id: "item-4",
      listId: "list-coop",
      gameId: "apex-legends",
      status: "Playing",
      progress: 0.35,
      playtimeMinutes: 780,
      lastPlayedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 72)),
      isInstalled: true,
    },
  ],
  playSessions: [
    {
      id: "session-1",
      userId: "demo-user",
      gameId: "elden-ring",
      minutes: 95,
      playedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24)),
    },
    {
      id: "session-2",
      userId: "demo-user",
      gameId: "apex-legends",
      minutes: 60,
      playedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 12)),
    },
  ],
  activity: [
    {
      id: "activity-1",
      userId: "demo-user",
      type: "achievement",
      title: "Unlocked Warm Up",
      description: "Logged the first tracked play session.",
      createdAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 6)),
      relatedAchievementId: "first-play-session",
      relatedCategory: "playtime",
    },
    {
      id: "activity-2",
      userId: "demo-user",
      type: "play",
      title: "95 minutes in Elden Ring",
      description: "Logged a new play session.",
      createdAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24)),
      relatedGameId: "elden-ring",
    },
    {
      id: "activity-3",
      userId: "demo-user",
      type: "list",
      title: "Added Cyberpunk 2077 to Backlog",
      description: "Organised your Backlog list.",
      createdAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 48)),
      relatedGameId: "cyberpunk-2077",
    },
  ],
};

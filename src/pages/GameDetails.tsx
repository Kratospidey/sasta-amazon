import { useParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import { useTracker } from "@/contexts/TrackerContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { format } from "date-fns";

const GameDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const {
    games,
    platforms,
    achievements,
    achievementUnlocks,
    lists,
    listItems,
    addGameToList,
    updateListItem,
    logPlaySession,
    unlockAchievement,
  } = useTracker();

  const game = games.find((candidate) => candidate.id === id);
  if (!game) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-10 text-center">
              <CardTitle className="text-xl">Game not found</CardTitle>
              <CardDescription className="mt-2">
                The game you are looking for is not part of the catalogue yet. Return to the catalogue to explore more titles.
              </CardDescription>
              <Button asChild className="mt-4">
                <Link to="/games">Browse games</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const platformLabels = game.platforms
    .map((platformId) => platforms.find((platform) => platform.id === platformId)?.name)
    .filter(Boolean) as string[];

  const userListItems = user
    ? listItems.filter((item) =>
        item.gameId === game.id && lists.some((list) => list.id === item.listId && list.userId === user.id),
      )
    : [];
  const trackedItem = userListItems[0];
  const backlog = user ? lists.find((list) => list.userId === user.id && list.name === "Backlog") : null;
  const playingList = user ? lists.find((list) => list.userId === user.id && list.name === "Playing") : null;
  const completedList = user ? lists.find((list) => list.userId === user.id && list.name === "Completed") : null;

  const gameAchievements = achievements.filter((achievement) => achievement.gameId === game.id);
  const userUnlocks = user
    ? achievementUnlocks.filter((unlock) => unlock.userId === user.id && gameAchievements.some((ach) => ach.id === unlock.achievementId))
    : [];

  const handleAddToBacklog = () => {
    if (!user || !backlog) {
      toast.error("Sign in to track this game");
      return;
    }
    addGameToList({ listId: backlog.id, gameId: game.id, status: "Backlog" });
    toast.success("Added to backlog");
  };

  const handleStartPlaying = () => {
    if (!user || !playingList) {
      toast.error("Sign in to move this game to Playing");
      return;
    }
    if (trackedItem) {
      updateListItem(trackedItem.id, { listId: playingList.id, status: "Playing" });
    } else {
      addGameToList({ listId: playingList.id, gameId: game.id, status: "Playing" });
    }
    toast.success("Marked as playing");
  };

  const handleComplete = () => {
    if (!user || !completedList) {
      toast.error("Sign in to complete games");
      return;
    }
    if (trackedItem) {
      updateListItem(trackedItem.id, { listId: completedList.id, status: "Completed", progress: 1 });
    } else {
      addGameToList({ listId: completedList.id, gameId: game.id, status: "Completed" });
    }
    toast.success("Marked as completed");
  };

  const handleLogSession = () => {
    if (!user) {
      toast.error("Sign in to log playtime");
      return;
    }
    logPlaySession({ userId: user.id, gameId: game.id, minutes: 45 });
    toast.success("Logged 45 minutes");
  };

  const handleUnlock = (achievementId: string) => {
    if (!user) {
      toast.error("Sign in to unlock achievements");
      return;
    }
    unlockAchievement({ userId: user.id, achievementId });
    toast.success("Achievement recorded");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <section className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <Card className="overflow-hidden">
            <div className="h-64 w-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">Cover art placeholder</span>
            </div>
            <CardHeader className="gap-3">
              <div>
                <CardTitle className="text-3xl font-bold">{game.title}</CardTitle>
                <CardDescription>Developed by {game.developer}</CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {platformLabels.map((label) => (
                  <Badge key={label} variant="outline" className="uppercase">
                    {label}
                  </Badge>
                ))}
                {game.genres.map((genre) => (
                  <Badge key={genre} variant="secondary" className="capitalize">
                    {genre}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>{game.description}</p>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Average runtime</p>
                  <p className="text-lg font-semibold text-foreground">{Math.round(game.averagePlaytime / 60)} hours</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Release date</p>
                  <p className="text-lg font-semibold text-foreground">{format(new Date(game.releaseDate), "PPP")}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Progress</p>
                  <p className="text-lg font-semibold text-foreground">
                    {trackedItem ? `${Math.round(trackedItem.progress * 100)}%` : "Not tracked"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Tracking</CardTitle>
              <CardDescription>Keep this game up to date</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button onClick={handleAddToBacklog} variant="outline">
                Add to backlog
              </Button>
              <Button onClick={handleStartPlaying} variant="outline">
                Mark as playing
              </Button>
              <Button onClick={handleComplete} variant="outline">
                Mark as completed
              </Button>
              <Button onClick={handleLogSession}>Log 45 minutes</Button>
              {trackedItem && (
                <div className="rounded-md border border-border/50 p-4 text-sm space-y-2">
                  <p className="text-xs uppercase text-muted-foreground">Current status</p>
                  <p className="text-lg font-semibold">{trackedItem.status}</p>
                  <Progress value={trackedItem.progress * 100} />
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <span>Playtime: {Math.round(trackedItem.playtimeMinutes / 60)} hrs</span>
                    <span>Last played: {trackedItem.lastPlayedAt ? format(new Date(trackedItem.lastPlayedAt), "MMM d") : "--"}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-[2fr,1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Achievement list</CardTitle>
              <CardDescription>Track your unlock progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {gameAchievements.length === 0 ? (
                <p className="text-sm text-muted-foreground">No achievements defined yet.</p>
              ) : (
                gameAchievements.map((achievement) => {
                  const unlock = userUnlocks.find((candidate) => candidate.achievementId === achievement.id);
                  return (
                    <div
                      key={achievement.id}
                      className="rounded-md border border-border/60 px-4 py-3 flex flex-col gap-2 text-sm"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-foreground">{achievement.name}</p>
                          <p className="text-muted-foreground">{achievement.description}</p>
                        </div>
                        <Badge variant={unlock ? "default" : "outline"}>
                          {unlock ? "Unlocked" : `${achievement.xp} XP`}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                        <span className="capitalize">{achievement.rarity} rarity</span>
                        <span>
                          {unlock ? `Unlocked on ${format(new Date(unlock.unlockedAt), "PP")}` : "Not unlocked yet"}
                        </span>
                      </div>
                      {!unlock && (
                        <Button size="sm" variant="ghost" className="self-start" onClick={() => handleUnlock(achievement.id)}>
                          Mark as unlocked
                        </Button>
                      )}
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related games</CardTitle>
              <CardDescription>Discover similar experiences</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {games
                .filter((candidate) => candidate.id !== game.id && candidate.genres.some((genre) => game.genres.includes(genre)))
                .slice(0, 4)
                .map((candidate) => (
                  <Link
                    key={candidate.id}
                    to={`/game/${candidate.id}`}
                    className="rounded-md border border-border/60 px-3 py-2 text-sm hover:border-primary/60"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{candidate.title}</span>
                      <Badge variant="secondary" className="capitalize">
                        {candidate.genres[0]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(candidate.averagePlaytime / 60)} hrs · {candidate.platforms.length} platforms
                    </p>
                  </Link>
                ))}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default GameDetails;

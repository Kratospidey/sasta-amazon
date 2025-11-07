import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import { useTracker } from "@/contexts/TrackerContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { format } from "date-fns";

const GameDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { games, platforms, lists, listItems, addGameToList, updateListItem, logPlaySession, createList } =
    useTracker();
  const [sessionMinutes, setSessionMinutes] = useState<number>(30);

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

  const getOrCreateListId = (name: string) => {
    if (!user) return "";
    const existing = lists.find(
      (list) => list.userId === user.id && list.name.toLowerCase() === name.toLowerCase(),
    );
    return existing?.id || createList({ userId: user.id, name });
  };

  const libraryStatuses = ["Backlog", "Playing", "Completed", "Dropped"] as const;

  const handleSetStatus = (status: (typeof libraryStatuses)[number]) => {
    if (!user) {
      toast.error("Sign in to update this status");
      return;
    }
    const targetListId = getOrCreateListId(status);
    if (!targetListId) {
      toast.error("Unable to update status");
      return;
    }

    if (trackedItem) {
      updateListItem(trackedItem.id, {
        listId: targetListId,
        status,
        ...(status === "Completed" ? { progress: 1 } : {}),
      });
    } else {
      addGameToList({ listId: targetListId, gameId: game.id, status });
    }

    toast.success(`Status set to ${status}`);
  };

  const handleLogSession = () => {
    if (!user) {
      toast.error("Sign in to log playtime");
      return;
    }
    const safeMinutes = Number.isFinite(sessionMinutes) ? Math.max(5, Math.min(1440, sessionMinutes)) : 30;
    setSessionMinutes(safeMinutes);
    logPlaySession({ userId: user.id, gameId: game.id, minutes: safeMinutes });
    toast.success(`Logged ${safeMinutes} minute${safeMinutes === 1 ? "" : "s"}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <section className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <Card className="overflow-hidden">
            <div className="h-64 w-full bg-muted flex items-center justify-center">
              <img
                src={game.coverImage}
                alt={`${game.title} cover art`}
                className="h-full w-full object-cover"
              />
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
            <CardContent className="flex flex-col gap-4">
              <div className="space-y-2">
                <p className="text-xs uppercase text-muted-foreground">Library status</p>
                <div className="grid grid-cols-2 gap-2">
                  {libraryStatuses.map((status) => (
                    <Button
                      key={status}
                      type="button"
                      variant={trackedItem?.status === status ? "default" : "outline"}
                      onClick={() => handleSetStatus(status)}
                      disabled={!user}
                      aria-pressed={trackedItem?.status === status}
                      className="justify-center"
                    >
                      {status}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Choose one status to decide where this game appears across your library views.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase text-muted-foreground">Log a play session</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    type="number"
                    min={5}
                    max={1440}
                    step={5}
                    value={sessionMinutes}
                    onChange={(event) => setSessionMinutes(Number(event.target.value) || 0)}
                    className="w-28"
                    disabled={!user}
                    aria-label="Play session length in minutes"
                  />
                  <span className="text-sm text-muted-foreground">minutes</span>
                  <Button type="button" onClick={handleLogSession} disabled={!user}>
                    Log session
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Track how long you play this game to build your weekly and lifetime totals.
                </p>
              </div>

              {!user && (
                <Button asChild>
                  <Link to="/profile">Sign in to update tracking</Link>
                </Button>
              )}

              {trackedItem && (
                <div className="rounded-md border border-border/50 p-4 text-sm space-y-2">
                  <p className="text-xs uppercase text-muted-foreground">Current status</p>
                  <p className="text-lg font-semibold">{trackedItem.status}</p>
                  <Progress value={trackedItem.progress * 100} />
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <span>Playtime: {Math.round(trackedItem.playtimeMinutes / 60)} hrs</span>
                    <span>
                      Last played: {trackedItem.lastPlayedAt ? format(new Date(trackedItem.lastPlayedAt), "MMM d") : "--"}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-[2fr,1fr]">
          <Card>
            <CardHeader>
              <CardTitle>GameVault milestones</CardTitle>
              <CardDescription>Milestones apply to your entire GameVault profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                Achievements are tracked globally across your library. Visit the milestones hub to review automatic
                unlocks for library size, playtime, and engagement streaks.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link to="/achievements">Open milestones hub</Link>
              </Button>
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

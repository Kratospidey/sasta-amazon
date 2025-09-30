import Header from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useTracker } from "@/contexts/TrackerContext";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const Index = () => {
  const { user } = useAuth();
  const { lists, listItems, games, activity, achievements, achievementUnlocks } = useTracker();

  const userLists = lists.filter((list) => (user ? list.userId === user.id : false));
  const libraryItems = listItems.filter((item) => userLists.some((list) => list.id === item.listId));
  const playing = libraryItems.filter((item) => item.status === "Playing");
  const backlog = libraryItems.filter((item) => item.status === "Backlog");
  const completed = libraryItems.filter((item) => item.status === "Completed");

  const totalHours = libraryItems.reduce((sum, item) => sum + item.playtimeMinutes, 0) / 60;
  const unlockedAchievements = achievementUnlocks.filter((unlock) => unlock.userId === user?.id);
  const recentActivity = activity.filter((event) => (user ? event.userId === user.id : false)).slice(0, 5);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to GameVault Tracker</CardTitle>
              <CardDescription>Sign in to start logging playtime, managing lists, and unlocking achievements.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/profile">Get started</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <section className="grid gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Hours tracked</CardTitle>
                <CardDescription>Total recorded playtime</CardDescription>
              </CardHeader>
              <CardContent className="text-3xl font-bold">
                {totalHours.toFixed(1)} hrs
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Active games</CardTitle>
                <CardDescription>Currently marked as playing</CardDescription>
              </CardHeader>
              <CardContent className="text-3xl font-bold">{playing.length}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Achievements unlocked</CardTitle>
                <CardDescription>Across tracked games</CardDescription>
              </CardHeader>
              <CardContent className="text-3xl font-bold">{unlockedAchievements.length}</CardContent>
            </Card>
          </section>

          <section className="grid gap-4 lg:grid-cols-[2fr,1fr]">
            <Card className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle>Now playing</CardTitle>
                    <CardDescription>Track progress and log quick sessions</CardDescription>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/lists">View all lists</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {playing.length === 0 ? (
                  <div className="rounded-md border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
                    Mark a game as playing to see it here.
                  </div>
                ) : (
                  playing.slice(0, 4).map((item) => {
                    const game = games.find((game) => game.id === item.gameId);
                    if (!game) return null;
                    return (
                      <div key={item.id} className="rounded-lg border border-border/60 p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-lg font-semibold">{game.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.lastPlayedAt ? `Last played ${formatDistanceToNow(new Date(item.lastPlayedAt))} ago` : "Not played yet"}
                            </p>
                          </div>
                          <Badge variant="outline">{Math.round(item.playtimeMinutes / 60)} hrs logged</Badge>
                        </div>
                        <Progress value={item.progress * 100} />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{Math.round(item.progress * 100)}% complete</span>
                          <Link to={`/game/${game.id}`} className="text-primary hover:underline">
                            View details
                          </Link>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Backlog snapshot</CardTitle>
                <CardDescription>Top of your queue</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {backlog.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Your backlog is empty—add games from the catalogue.</p>
                ) : (
                  backlog.slice(0, 4).map((item) => {
                    const game = games.find((game) => game.id === item.gameId);
                    if (!game) return null;
                    return (
                      <div key={item.id} className="rounded-md border border-border/50 px-3 py-2 text-sm">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-medium">{game.title}</span>
                          <Badge variant="secondary" className="capitalize">
                            {game.genres[0]}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.lastPlayedAt ? `Last touched ${formatDistanceToNow(new Date(item.lastPlayedAt))} ago` : "Not started"}
                        </p>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-4 lg:grid-cols-[1fr,1fr]">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Lifetime stats</CardTitle>
                <CardDescription>Quick overview across lists</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-md border border-border/60 p-4">
                    <p className="text-muted-foreground text-xs uppercase">Backlog</p>
                    <p className="text-2xl font-semibold">{backlog.length}</p>
                  </div>
                  <div className="rounded-md border border-border/60 p-4">
                    <p className="text-muted-foreground text-xs uppercase">Completed</p>
                    <p className="text-2xl font-semibold">{completed.length}</p>
                  </div>
                  <div className="rounded-md border border-border/60 p-4">
                    <p className="text-muted-foreground text-xs uppercase">Library size</p>
                    <p className="text-2xl font-semibold">{libraryItems.length}</p>
                  </div>
                  <div className="rounded-md border border-border/60 p-4">
                    <p className="text-muted-foreground text-xs uppercase">Lists maintained</p>
                    <p className="text-2xl font-semibold">{userLists.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Recent activity</CardTitle>
                <CardDescription>Achievements, play sessions, and list updates</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
                ) : (
                  recentActivity.map((event) => {
                    const game = event.relatedGameId ? games.find((g) => g.id === event.relatedGameId) : null;
                    const achievement = event.relatedAchievementId
                      ? achievements.find((ach) => ach.id === event.relatedAchievementId)
                      : null;
                    return (
                      <div key={event.id} className="rounded-md border border-border/60 px-3 py-2 text-sm flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{event.title}</span>
                          <Badge variant="outline" className={cn(event.type === "achievement" && "border-primary/60 text-primary")}
                          >
                            {event.type}
                          </Badge>
                        </div>
                        {game && <span className="text-xs text-muted-foreground">{game.title}</span>}
                        {achievement && <span className="text-xs text-muted-foreground">{achievement.name}</span>}
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(event.createdAt))} ago
                        </span>
                      </div>
                    );
                  })
                )}
                <Button asChild variant="ghost" size="sm" className="self-start">
                  <Link to="/activity">See all activity</Link>
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;

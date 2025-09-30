import Header from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useTracker } from "@/contexts/TrackerContext";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

const rarityColor: Record<string, string> = {
  common: "bg-muted text-foreground",
  uncommon: "bg-emerald-500/10 text-emerald-300",
  rare: "bg-indigo-500/10 text-indigo-300",
  legendary: "bg-amber-500/10 text-amber-300",
};

const Achievements = () => {
  const { user } = useAuth();
  const { achievements, achievementUnlocks, games } = useTracker();

  const userUnlocks = achievementUnlocks.filter((unlock) => unlock.userId === user?.id);

  const achievementsByGame = games.map((game) => {
    const gameAchievements = achievements.filter((achievement) => achievement.gameId === game.id);
    const unlocked = userUnlocks.filter((unlock) => gameAchievements.some((achievement) => achievement.id === unlock.achievementId));
    return {
      game,
      total: gameAchievements.length,
      unlocked,
      gameAchievements,
    };
  });

  const totalUnlocked = userUnlocks.length;
  const totalAvailable = achievements.length;

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Sign in to view achievements</CardTitle>
              <CardDescription>Track progress and unlock history once you are logged in.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/profile">Access profile</Link>
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
          <div>
            <h1 className="text-3xl font-bold">Achievements</h1>
            <p className="text-muted-foreground text-sm">
              Track your progress across every game and celebrate hard-earned milestones.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total unlocked</CardTitle>
                <CardDescription>Across your entire library</CardDescription>
              </CardHeader>
              <CardContent className="text-3xl font-bold">{totalUnlocked}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total available</CardTitle>
                <CardDescription>Games in catalogue</CardDescription>
              </CardHeader>
              <CardContent className="text-3xl font-bold">{totalAvailable}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Completion rate</CardTitle>
                <CardDescription>Unlocked vs. total</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">
                    {totalAvailable === 0 ? 0 : Math.round((totalUnlocked / totalAvailable) * 100)}%
                  </span>
                  <span className="text-xs text-muted-foreground">complete</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="recent" className="space-y-4">
            <TabsList>
              <TabsTrigger value="recent">Recent unlocks</TabsTrigger>
              <TabsTrigger value="by-game">By game</TabsTrigger>
            </TabsList>

            <TabsContent value="recent" className="space-y-3">
              {userUnlocks.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center text-sm text-muted-foreground">
                    Start logging achievements to see them appear here.
                  </CardContent>
                </Card>
              ) : (
                userUnlocks
                  .slice()
                  .sort((a, b) => (a.unlockedAt < b.unlockedAt ? 1 : -1))
                  .map((unlock) => {
                    const achievement = achievements.find((ach) => ach.id === unlock.achievementId);
                    if (!achievement) return null;
                    const game = games.find((g) => g.id === achievement.gameId);
                    if (!game) return null;
                    return (
                      <Card key={unlock.id}>
                        <CardHeader className="flex flex-col gap-1">
                          <div className="flex items-center justify-between gap-2">
                            <CardTitle className="text-lg">{achievement.name}</CardTitle>
                            <Badge className={rarityColor[achievement.rarity]}>{achievement.rarity}</Badge>
                          </div>
                          <CardDescription>{game.title}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
                          <p>{achievement.description}</p>
                          <p>Unlocked {formatDistanceToNow(new Date(unlock.unlockedAt))} ago</p>
                        </CardContent>
                      </Card>
                    );
                  })
              )}
            </TabsContent>

            <TabsContent value="by-game" className="space-y-6">
              {achievementsByGame.map(({ game, total, unlocked, gameAchievements }) => (
                <Card key={game.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <CardTitle>{game.title}</CardTitle>
                        <CardDescription>
                          {unlocked.length} of {total} unlocked
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{Math.round((unlocked.length / Math.max(total, 1)) * 100)}%</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Progress value={(unlocked.length / Math.max(total, 1)) * 100} />
                    <div className="grid gap-3 md:grid-cols-2">
                      {gameAchievements.map((achievement) => {
                        const isUnlocked = unlocked.some((unlock) => unlock.achievementId === achievement.id);
                        return (
                          <div
                            key={achievement.id}
                            className="rounded-md border border-border/60 p-4 text-sm flex flex-col gap-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold">{achievement.name}</span>
                              <Badge className={rarityColor[achievement.rarity]}>{achievement.rarity}</Badge>
                            </div>
                            <p className="text-muted-foreground">{achievement.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {isUnlocked
                                ? `Unlocked ${formatDistanceToNow(new Date(
                                    userUnlocks.find((unlock) => unlock.achievementId === achievement.id)!.unlockedAt,
                                  ))} ago`
                                : "Not unlocked yet"}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Achievements;

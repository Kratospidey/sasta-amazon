import { useMemo } from "react";
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
import { toast } from "sonner";
import type { Achievement } from "@/lib/trackerTypes";
import { isAutomaticallyTrackedAchievement } from "@/lib/achievementRules";

const rarityColor: Record<string, string> = {
  common: "bg-muted text-foreground",
  uncommon: "bg-emerald-500/10 text-emerald-300",
  rare: "bg-indigo-500/10 text-indigo-300",
  legendary: "bg-amber-500/10 text-amber-300",
};

const categoryOrder: Achievement["category"][] = ["library", "playtime", "engagement", "social"];

const categoryLabels: Record<Achievement["category"], string> = {
  library: "Library milestones",
  playtime: "Playtime goals",
  engagement: "Engagement streaks",
  social: "Social sharing",
};

const categoryDescriptions: Record<Achievement["category"], string> = {
  library: "Keep expanding and curating your library.",
  playtime: "Log hours to reach new milestones.",
  engagement: "Build consistent habits in GameVault.",
  social: "Share progress and connect with friends.",
};

const Achievements = () => {
  const { user } = useAuth();
  const { achievements, achievementUnlocks, unlockAchievement } = useTracker();

  const userUnlocks = achievementUnlocks.filter((unlock) => unlock.userId === user?.id);

  const achievementsByCategory = useMemo(() => {
    const categories = Array.from(new Set(achievements.map((achievement) => achievement.category)));
    const sortedCategories = categories.sort((a, b) => {
      const indexA = categoryOrder.indexOf(a);
      const indexB = categoryOrder.indexOf(b);
      const safeA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
      const safeB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;
      return safeA - safeB;
    });

    return sortedCategories.map((category) => {
      const categoryAchievements = achievements.filter((achievement) => achievement.category === category);
      const unlocked = userUnlocks.filter((unlock) =>
        categoryAchievements.some((achievement) => achievement.id === unlock.achievementId),
      );
      return {
        category,
        total: categoryAchievements.length,
        unlocked,
        categoryAchievements,
      };
    });
  }, [achievements, userUnlocks]);

  const totalUnlocked = userUnlocks.length;
  const totalAvailable = achievements.length;

  const handleUnlock = (achievementId: string) => {
    if (!user) {
      toast.error("Sign in to unlock achievements");
      return;
    }
    unlockAchievement({ userId: user.id, achievementId });
    toast.success("Achievement recorded");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Sign in to track achievements</CardTitle>
              <CardDescription>
                Unlock personal GameVault milestones—like library size, hours played, and streaks—once you are logged in.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/profile">Sign in to manage achievements</Link>
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
            <h1 className="text-3xl font-bold">GameVault milestones</h1>
            <p className="text-muted-foreground text-sm">
              Track personal goals across your entire library—library size, hours played, engagement streaks, and more.
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
                <CardDescription>Platform milestones to chase</CardDescription>
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
              <TabsTrigger value="by-category">By milestone</TabsTrigger>
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
                    return (
                      <Card key={unlock.id}>
                        <CardHeader className="flex flex-col gap-1">
                          <div className="flex items-center justify-between gap-2">
                            <CardTitle className="text-lg">{achievement.name}</CardTitle>
                            <Badge className={rarityColor[achievement.rarity]}>{achievement.rarity}</Badge>
                          </div>
                          <CardDescription>{categoryLabels[achievement.category]}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
                          <p>{achievement.description}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{achievement.xp} XP</span>
                            <span>Unlocked {formatDistanceToNow(new Date(unlock.unlockedAt))} ago</span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
              )}
            </TabsContent>

            <TabsContent value="by-category" className="space-y-6">
              {achievements.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center text-sm text-muted-foreground">
                    No platform achievements defined yet.
                  </CardContent>
                </Card>
              ) : (
                achievementsByCategory.map(({ category, total, unlocked, categoryAchievements }) => (
                  <Card key={category}>
                    <CardHeader>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <CardTitle>{categoryLabels[category]}</CardTitle>
                          <CardDescription>
                            {unlocked.length} of {total} unlocked
                          </CardDescription>
                        </div>
                        <Badge variant="outline">{Math.round((unlocked.length / Math.max(total, 1)) * 100)}%</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{categoryDescriptions[category]}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Progress value={(unlocked.length / Math.max(total, 1)) * 100} />
                      <div className="grid gap-3 md:grid-cols-2">
                        {categoryAchievements.map((achievement) => {
                          const unlock = unlocked.find((item) => item.achievementId === achievement.id);
                          const automated = isAutomaticallyTrackedAchievement(achievement.id);
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
                              {automated && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Badge variant="outline">Auto-tracked</Badge>
                                  <span>Unlocks automatically once the condition is met.</span>
                                </div>
                              )}
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{achievement.xp} XP</span>
                                <span>
                                  {unlock
                                    ? `Unlocked ${formatDistanceToNow(new Date(unlock.unlockedAt))} ago`
                                    : "Not unlocked yet"}
                                </span>
                              </div>
                              {!unlock && !automated && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="self-start"
                                  onClick={() => handleUnlock(achievement.id)}
                                >
                                  Mark as unlocked
                                </Button>
                              )}
                              {!unlock && automated && (
                                <p className="text-xs italic text-muted-foreground">
                                  Keep tracking your progress—this achievement will unlock for you.
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Achievements;

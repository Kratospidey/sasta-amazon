import Header from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useTracker } from "@/contexts/TrackerContext";
import { formatDistanceToNow } from "date-fns";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import type { Achievement } from "@/lib/trackerTypes";

const typeLabels: Record<string, string> = {
  all: "All activity",
  play: "Play sessions",
  achievement: "Achievements",
  list: "List changes",
  reminder: "Reminders",
};

const achievementCategoryLabels: Record<Achievement["category"], string> = {
  library: "Library milestones",
  playtime: "Playtime goals",
  engagement: "Engagement streaks",
  social: "Social sharing",
};

const Notifications = () => {
  const { user } = useAuth();
  const { activity, games, achievements } = useTracker();
  const [activeTab, setActiveTab] = useState<keyof typeof typeLabels>("all");

  const userActivity = useMemo(
    () => activity.filter((event) => (user ? event.userId === user.id : false)),
    [activity, user],
  );

  const activityCounts = useMemo(() => {
    return userActivity.reduce<Record<string, number>>(
      (counts, event) => {
        counts.all += 1;
        counts[event.type] = (counts[event.type] ?? 0) + 1;
        return counts;
      },
      { all: 0 },
    );
  }, [userActivity]);

  const filteredActivity = useMemo(() => {
    if (activeTab === "all") return userActivity;
    return userActivity.filter((event) => event.type === activeTab);
  }, [activeTab, userActivity]);

  const handleAddReminder = () => {
    toast.info("Reminder scheduling is coming soon.");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Sign in to view activity</CardTitle>
              <CardDescription>
                Review play sessions, status changes, and milestones from your personal GameVault activity feed after
                logging in.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/profile">Sign in to view activity</Link>
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
          <section className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold">Activity feed</h1>
              <p className="text-muted-foreground text-sm">
                Track achievement unlocks, list changes, and play sessions for your account.
              </p>
            </div>
            <div className="flex flex-col items-start gap-1">
              <Button variant="outline" size="sm" onClick={handleAddReminder} disabled>
                Add reminder
              </Button>
              <span className="text-xs text-muted-foreground">Reminders are coming soon.</span>
            </div>
          </section>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as keyof typeof typeLabels)}>
            <TabsList className="flex flex-wrap">
              {Object.entries(typeLabels).map(([key, label]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  disabled={key !== "all" && (activityCounts[key] ?? 0) === 0}
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={activeTab} className="mt-4 space-y-3">
              {filteredActivity.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center text-sm text-muted-foreground">
                    No activity yet. Log a play session on any game to populate this feed.
                  </CardContent>
                </Card>
              ) : (
                filteredActivity.map((event) => {
                  const game = event.relatedGameId ? games.find((candidate) => candidate.id === event.relatedGameId) : null;
                  const achievement = event.relatedAchievementId
                    ? achievements.find((candidate) => candidate.id === event.relatedAchievementId)
                    : null;
                  const categoryLabel = achievement ? achievementCategoryLabels[achievement.category] : null;
                  return (
                    <Card key={event.id}>
                      <CardHeader className="flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-3">
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <Badge variant="outline" className="capitalize">
                            {event.type}
                          </Badge>
                        </div>
                        <CardDescription>
                          {formatDistanceToNow(new Date(event.createdAt))} ago
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
                        <p>{event.description}</p>
                        {game && <p>Game: {game.title}</p>}
                        {achievement && (
                          <p>
                            Achievement: {achievement.name}
                            {categoryLabel ? ` • ${categoryLabel}` : ""}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Notifications;

import Header from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useTracker } from "@/contexts/TrackerContext";
import { formatDistanceToNow } from "date-fns";
import { useMemo, useState } from "react";
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
  const { activity, games, achievements, recordActivity } = useTracker();
  const [activeTab, setActiveTab] = useState<keyof typeof typeLabels>("all");

  const userActivity = useMemo(
    () => activity.filter((event) => (user ? event.userId === user.id : false)),
    [activity, user],
  );

  const filteredActivity = useMemo(() => {
    if (activeTab === "all") return userActivity;
    return userActivity.filter((event) => event.type === activeTab);
  }, [activeTab, userActivity]);

  const handleAddReminder = () => {
    if (!user) {
      toast.error("Sign in to schedule reminders");
      return;
    }
    const title = window.prompt("Reminder title", "Check backlog this weekend");
    if (!title) return;
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 11);
    recordActivity({
      id: `activity-${id}`,
      userId: user.id,
      type: "reminder",
      title,
      description: "Manual reminder",
      createdAt: new Date().toISOString(),
    });
    toast.success("Reminder added to your feed");
  };

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
            <Button variant="outline" size="sm" onClick={handleAddReminder}>
              Add reminder
            </Button>
          </section>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as keyof typeof typeLabels)}>
            <TabsList className="flex flex-wrap">
              {Object.entries(typeLabels).map(([key, label]) => (
                <TabsTrigger key={key} value={key}>
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={activeTab} className="mt-4 space-y-3">
              {filteredActivity.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center text-sm text-muted-foreground">
                    No activity yet. Start tracking games to populate this feed.
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

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useTracker } from "@/contexts/TrackerContext";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const statusOptions = ["Backlog", "Playing", "Completed"];

const Library = () => {
  const { user } = useAuth();
  const { lists, listItems, games, createList, updateListItem, logPlaySession, deleteList } = useTracker();
  const userLists = useMemo(() => lists.filter((list) => (user ? list.userId === user.id : false)), [lists, user]);
  const [activeListId, setActiveListId] = useState<string | null>(userLists[0]?.id ?? null);

  useEffect(() => {
    if (userLists.length && !activeListId) {
      setActiveListId(userLists[0].id);
    }
  }, [userLists, activeListId]);

  const activeList = userLists.find((list) => list.id === activeListId) ?? userLists[0];
  const itemsForActiveList = listItems.filter((item) => item.listId === activeList?.id);

  const statusCounts = useMemo(() => {
    return statusOptions.reduce<Record<string, number>>((acc, status) => {
      acc[status] = listItems.filter(
        (item) => item.status === status && userLists.some((list) => list.id === item.listId),
      ).length;
      return acc;
    }, {});
  }, [listItems, userLists]);

  const handleCreateList = () => {
    if (!user) {
      toast.error("Sign in to manage lists");
      return;
    }
    const name = window.prompt("List name");
    if (!name) return;
    const newId = createList({ userId: user.id, name });
    setActiveListId(newId);
    toast.success("List created");
  };

  const handleStatusChange = (itemId: string, status: string) => {
    const destination = userLists.find((list) => list.name === status) ?? activeList;
    if (!destination) return;
    updateListItem(itemId, { status, listId: destination.id });
    toast.success(`Marked as ${status}`);
  };

  const handleLogSession = (gameId: string) => {
    if (!user) {
      toast.error("Sign in to record playtime");
      return;
    }
    logPlaySession({ userId: user.id, gameId, minutes: 30 });
    toast.success("Logged 30 minutes");
  };

  const handleDeleteList = () => {
    if (!activeList || activeList.type === "default") return;
    deleteList(activeList.id);
    setActiveListId(userLists.find((list) => list.type === "default")?.id ?? null);
    toast.success("List removed");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Sign in to manage lists</CardTitle>
              <CardDescription>Your backlog, playing, and completed lists are available after login.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/profile">Go to profile</Link>
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
          <section className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold">My Lists</h1>
              <p className="text-muted-foreground text-sm">
                Organise your backlog, track what you are playing, and celebrate the games you have completed.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {statusOptions.map((status) => (
                <Badge key={status} variant="outline" className="capitalize">
                  {status}: {statusCounts[status] ?? 0}
                </Badge>
              ))}
              <Button variant="outline" size="sm" onClick={handleCreateList}>
                Create list
              </Button>
              {activeList && activeList.type === "custom" && (
                <Button variant="ghost" size="sm" onClick={handleDeleteList}>
                  Delete list
                </Button>
              )}
              <Button asChild variant="ghost" size="sm">
                <Link to="/games">Add games</Link>
              </Button>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[280px,1fr]">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Lists</CardTitle>
                <CardDescription>Select a list to manage games</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {userLists.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Create your first list to start tracking games.</p>
                ) : (
                  userLists.map((list) => (
                    <button
                      key={list.id}
                      onClick={() => setActiveListId(list.id)}
                      className={`rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                        activeList?.id === list.id
                          ? "border-primary/70 bg-primary/10 text-primary"
                          : "border-border hover:border-primary/60"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span>{list.name}</span>
                        <Badge variant="outline">
                          {listItems.filter((item) => item.listId === list.id).length}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 capitalize">{list.type} list</p>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle>{activeList ? activeList.name : "No list selected"}</CardTitle>
                    <CardDescription>
                      {activeList
                        ? `${itemsForActiveList.length} game${itemsForActiveList.length === 1 ? "" : "s"} tracked`
                        : "Select a list to begin"}
                    </CardDescription>
                  </div>
                  {activeList && (
                    <Select
                      value={statusOptions.includes(activeList.name) ? activeList.name : "custom"}
                      onValueChange={(value) => {
                        const destination = userLists.find((list) => list.name === value);
                        if (destination) {
                          setActiveListId(destination.id);
                        }
                      }}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="View" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                        <SelectItem value="custom">Custom lists</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {activeList && itemsForActiveList.length === 0 && (
                  <div className="rounded-md border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
                    No games in this list yet.
                  </div>
                )}

                {activeList &&
                  itemsForActiveList.map((item) => {
                    const game = games.find((game) => game.id === item.gameId);
                    if (!game) return null;
                    return (
                      <div key={item.id} className="rounded-lg border border-border/70 p-4 flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-lg font-semibold">{game.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.lastPlayedAt
                                ? `Last played ${formatDistanceToNow(new Date(item.lastPlayedAt))} ago`
                                : "Not played yet"}
                            </p>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {item.status}
                          </Badge>
                        </div>
                        <Progress value={item.progress * 100} />
                        <div className="grid gap-2 text-xs text-muted-foreground md:grid-cols-3">
                          <span>Playtime: {Math.round(item.playtimeMinutes / 60)} hrs</span>
                          <span>Progress: {Math.round(item.progress * 100)}%</span>
                          <span>Installed: {item.isInstalled ? "Yes" : "No"}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {statusOptions.map((status) => (
                            <Button
                              key={status}
                              variant={status === item.status ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleStatusChange(item.id, status)}
                            >
                              {status}
                            </Button>
                          ))}
                          <Button variant="ghost" size="sm" onClick={() => handleLogSession(game.id)}>
                            Log 30 min
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Library;

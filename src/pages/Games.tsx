import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTracker } from "@/contexts/TrackerContext";
import { Link, useSearchParams } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Games = () => {
  const { user } = useAuth();
  const { games, platforms, lists, listItems, addGameToList, createList } = useTracker();
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("query") ?? "";
  const platformFilter = searchParams.get("platform") ?? "all";
  const genreFilter = searchParams.get("genre") ?? "all";

  const genres = useMemo(() => {
    const all = new Set<string>();
    games.forEach((game) => game.genres.forEach((genre) => all.add(genre)));
    return Array.from(all).sort();
  }, [games]);

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesQuery = query
        ? game.title.toLowerCase().includes(query.toLowerCase()) ||
          game.description.toLowerCase().includes(query.toLowerCase())
        : true;
      const matchesPlatform = platformFilter === "all" ? true : game.platforms.includes(platformFilter);
      const matchesGenre = genreFilter === "all" ? true : game.genres.includes(genreFilter);
      return matchesQuery && matchesPlatform && matchesGenre;
    });
  }, [games, query, platformFilter, genreFilter]);

  const handleFilterChange = (key: "platform" | "genre", value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === "all") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const handleAddToDefaultList = (gameId: string) => {
    if (!user) {
      toast.error("Sign in to track games from the catalogue");
      return;
    }
    const backlog = lists.find(
      (list) => list.userId === user.id && list.name.toLowerCase() === "backlog",
    );
    const backlogId = backlog?.id || createList({ userId: user.id, name: "Backlog" });
    if (!backlogId) {
      toast.error("Unable to create a backlog list");
      return;
    }
    const alreadyTracked = listItems.some((item) => item.gameId === gameId && item.listId === backlogId);
    if (alreadyTracked) {
      toast("This game is already in your backlog");
      return;
    }
    addGameToList({ listId: backlogId, gameId, status: "Backlog" });
    toast.success("Added to backlog");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div>
              <h1 className="text-3xl font-bold">Browse Games</h1>
              <p className="text-muted-foreground text-sm">
                Explore the catalogue and keep track of what you want to play next.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="w-full sm:w-auto">
                <Select value={platformFilter} onValueChange={(value) => handleFilterChange("platform", value)}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All platforms</SelectItem>
                    {platforms.map((platform) => (
                      <SelectItem key={platform.id} value={platform.id}>
                        {platform.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-auto">
                <Select value={genreFilter} onValueChange={(value) => handleFilterChange("genre", value)}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All genres</SelectItem>
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {filteredGames.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
              <p className="text-lg font-medium">No games match your filters yet.</p>
              <p className="text-muted-foreground text-sm mt-2">
                Try adjusting the filters or importing new games into your catalogue.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredGames.map((game) => {
                const trackedItem = user
                  ? listItems.find(
                      (item) =>
                        item.gameId === game.id &&
                        lists.some((list) => list.id === item.listId && list.userId === user.id),
                    )
                  : null;
                const isTracked = Boolean(trackedItem);
                return (
                  <Card key={game.id} className="flex flex-col overflow-hidden">
                    <div className="h-40 w-full overflow-hidden bg-muted">
                      <img
                        src={game.coverImage}
                        alt={`${game.title} cover art`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardHeader className="space-y-2">
                      <CardTitle className="flex items-center justify-between text-xl">
                        <Link to={`/game/${game.id}`} className="hover:text-primary">
                          {game.title}
                        </Link>
                        <Badge variant="outline">{Math.round(game.averagePlaytime / 60)} hrs avg</Badge>
                      </CardTitle>
                      <CardDescription>{game.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {game.genres.map((genre) => (
                        <Badge key={genre} variant="secondary" className="capitalize">
                          {genre}
                        </Badge>
                      ))}
                    </CardContent>
                    <CardFooter className="mt-auto flex flex-col gap-3">
                      <div className="flex flex-wrap gap-2">
                        {game.platforms.map((platformId) => {
                          const platform = platforms.find((p) => p.id === platformId);
                          if (!platform) return null;
                          return (
                            <Badge key={platformId} variant="outline" className="uppercase">
                              {platform.name}
                            </Badge>
                          );
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {trackedItem ? `Status: ${trackedItem.status}` : "Not in your library yet"}
                      </p>
                      <div className="flex w-full items-center justify-between gap-4">
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/game/${game.id}`}>View details</Link>
                        </Button>
                        {user ? (
                          <Button
                            variant={isTracked ? "outline" : "default"}
                            size="sm"
                            className={cn(isTracked && "border-primary/60 text-primary")}
                            onClick={() => handleAddToDefaultList(game.id)}
                          >
                            {isTracked ? "Status updated" : "Set status: Backlog"}
                          </Button>
                        ) : (
                          <Button asChild size="sm">
                            <Link to="/profile">Sign in to track</Link>
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Games;

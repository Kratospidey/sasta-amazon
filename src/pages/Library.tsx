import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Download, 
  Settings, 
  Trophy, 
  Clock, 
  Star,
  TrendingUp,
  Calendar,
  Filter
} from "lucide-react";
import Header from "@/components/layout/Header";
import eldenRingCover from "@/assets/elden-ring-cover.png";
import genshinImpactCover from "@/assets/genshin-impact-cover.png";
import fortniteCover from "@/assets/fortnite-cover.png";

const Library = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  // Mock library data
  const libraryGames = [
    {
      id: "1",
      title: "Elden Ring",
      developer: "FromSoftware",
      coverImage: eldenRingCover,
      playtime: "142 hours",
      lastPlayed: "2 hours ago",
      progress: 75,
      achievements: { unlocked: 28, total: 42 },
      installed: true,
      size: "60 GB"
    },
    {
      id: "2", 
      title: "Genshin Impact",
      developer: "miHoYo",
      coverImage: genshinImpactCover,
      playtime: "89 hours",
      lastPlayed: "1 day ago", 
      progress: 45,
      achievements: { unlocked: 156, total: 300 },
      installed: true,
      size: "45 GB"
    },
    {
      id: "3",
      title: "Valorant", 
      developer: "Riot Games",
      coverImage: "/game-3.jpg",
      playtime: "234 hours",
      lastPlayed: "5 minutes ago",
      progress: 100,
      achievements: { unlocked: 67, total: 67 },
      installed: true,
      size: "32 GB"
    },
    {
      id: "4",
      title: "Fortnite",
      developer: "Epic Games", 
      coverImage: fortniteCover,
      playtime: "78 hours",
      lastPlayed: "3 days ago",
      progress: 0,
      achievements: { unlocked: 23, total: 89 },
      installed: false,
      size: "28 GB"
    }
  ];

  const recentActivity = [
    { game: "Valorant", action: "Achievement unlocked: First Blood", time: "5 minutes ago", icon: <Trophy className="h-4 w-4 text-yellow-500" /> },
    { game: "Elden Ring", action: "Played for 3 hours", time: "2 hours ago", icon: <Clock className="h-4 w-4 text-blue-500" /> },
    { game: "Genshin Impact", action: "New character obtained", time: "1 day ago", icon: <Star className="h-4 w-4 text-purple-500" /> }
  ];

  const totalStats = {
    totalPlaytime: "543 hours",
    gamesOwned: libraryGames.length,
    achievementsUnlocked: libraryGames.reduce((sum, game) => sum + game.achievements.unlocked, 0),
    totalAchievements: libraryGames.reduce((sum, game) => sum + game.achievements.total, 0)
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Banner */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Welcome back, Gamer!</h1>
                  <p className="text-muted-foreground">Ready to continue your adventure?</p>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{totalStats.totalPlaytime}</div>
                    <div className="text-sm text-muted-foreground">Total Playtime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{totalStats.gamesOwned}</div>
                    <div className="text-sm text-muted-foreground">Games Owned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gaming-success">{totalStats.achievementsUnlocked}</div>
                    <div className="text-sm text-muted-foreground">Achievements</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* News Banner */}
        <div className="mb-8">
          <Card className="bg-gaming-surface border-gaming-glow/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-gaming-glow" />
                  <span className="font-medium">⚡ New Release: Elden Ring DLC Available • 🎮 Genshin Impact v5.0 Launching Soon • 🔥 Premium Sale: 50% Off Exclusives</span>
                </div>
                <Button variant="outline" size="sm">View All</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Library */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList className="grid w-fit grid-cols-4">
                  <TabsTrigger value="all">All Games</TabsTrigger>
                  <TabsTrigger value="installed">Installed</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                </TabsList>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {libraryGames.map((game) => (
                    <Card key={game.id} className="game-card group cursor-pointer">
                      <CardContent className="p-0">
                        <div className="relative">
                          <img 
                            src={game.coverImage} 
                            alt={game.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary-hover">
                              {game.installed ? <Play className="h-5 w-5 mr-2" /> : <Download className="h-5 w-5 mr-2" />}
                              {game.installed ? "Play" : "Install"}
                            </Button>
                          </div>
                          {!game.installed && (
                            <Badge className="absolute top-2 right-2 bg-gaming-warning text-black">
                              Not Installed
                            </Badge>
                          )}
                        </div>
                        
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-1">{game.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{game.developer}</p>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span>{game.progress}%</span>
                            </div>
                            <Progress value={game.progress} className="h-2" />
                          </div>
                          
                          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {game.playtime}
                            </div>
                            <div className="flex items-center gap-1">
                              <Trophy className="h-4 w-4" />
                              {game.achievements.unlocked}/{game.achievements.total}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                            <span>Last played: {game.lastPlayed}</span>
                            <span>{game.size}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="installed">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {libraryGames.filter(game => game.installed).map((game) => (
                    <Card key={game.id} className="game-card group cursor-pointer">
                      <CardContent className="p-0">
                        <div className="relative">
                          <img 
                            src={game.coverImage} 
                            alt={game.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary-hover">
                              <Play className="h-5 w-5 mr-2" />
                              Play
                            </Button>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-1">{game.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{game.developer}</p>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span>{game.progress}%</span>
                            </div>
                            <Progress value={game.progress} className="h-2" />
                          </div>
                          
                          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {game.playtime}
                            </div>
                            <div className="flex items-center gap-1">
                              <Trophy className="h-4 w-4" />
                              {game.achievements.unlocked}/{game.achievements.total}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                            <span>Last played: {game.lastPlayed}</span>
                            <Button variant="ghost" size="sm" className="p-0 h-auto">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="recent">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {libraryGames.slice(0, 3).map((game) => (
                    <Card key={game.id} className="game-card group cursor-pointer">
                      <CardContent className="p-0">
                        <div className="relative">
                          <img 
                            src={game.coverImage} 
                            alt={game.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary-hover">
                              <Play className="h-5 w-5 mr-2" />
                              Continue
                            </Button>
                          </div>
                          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                            Recently Played
                          </Badge>
                        </div>
                        
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-1">{game.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{game.developer}</p>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span>{game.progress}%</span>
                            </div>
                            <Progress value={game.progress} className="h-2" />
                          </div>
                          
                          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {game.playtime}
                            </div>
                            <span>Last played: {game.lastPlayed}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="favorites">
                <div className="text-center py-12">
                  <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No favorite games yet</h3>
                  <p className="text-muted-foreground">Star your favorite games to see them here</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Your Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Playtime</span>
                    <span className="font-medium">{totalStats.totalPlaytime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Games Owned</span>
                    <span className="font-medium">{totalStats.gamesOwned}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Achievements</span>
                    <span className="font-medium">{totalStats.achievementsUnlocked}/{totalStats.totalAchievements}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Completion Rate</span>
                    <span className="font-medium">
                      {Math.round((totalStats.achievementsUnlocked / totalStats.totalAchievements) * 100)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1">{activity.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.game}</p>
                        <p className="text-xs text-muted-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Recommended for You</h3>
                <div className="space-y-4">
                  {[
                    { title: "Cyberpunk 2077", genre: "RPG", price: "$29.99" },
                    { title: "Sekiro", genre: "Action", price: "$39.99" },
                    { title: "Hades", genre: "Roguelike", price: "$19.99" }
                  ].map((game, index) => (
                    <div key={index} className="flex gap-3">
                      <img 
                        src={`/game-${index + 1}.jpg`} 
                        alt={game.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{game.title}</h4>
                        <p className="text-xs text-muted-foreground">{game.genre}</p>
                        <p className="text-xs font-medium text-primary">{game.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
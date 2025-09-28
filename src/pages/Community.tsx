import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  MessageSquare, 
  Trophy, 
  Calendar,
  Search,
  TrendingUp,
  Heart,
  Share2,
  ThumbsUp,
  MessageCircle,
  Plus,
  Filter,
  Star
} from "lucide-react";
import Header from "@/components/layout/Header";

const Community = () => {
  const [selectedTab, setSelectedTab] = useState("discussions");

  const discussionPosts = [
    {
      id: 1,
      title: "Best strategies for Elden Ring boss fights",
      author: "SoulsMaster",
      avatar: "👤",
      content: "After 200+ hours, I've found some incredible strategies that work consistently...",
      likes: 156,
      replies: 23,
      tags: ["Elden Ring", "Tips", "Boss Fights"],
      timeAgo: "2 hours ago",
      trending: true
    },
    {
      id: 2,
      title: "Genshin Impact 5.0 Character Tier List",
      author: "GenshinPro",
      avatar: "👤",
      content: "Here's my updated tier list after extensive testing with the new characters...",
      likes: 89,
      replies: 45,
      tags: ["Genshin Impact", "Tier List", "Characters"],
      timeAgo: "4 hours ago",
      trending: false
    },
    {
      id: 3,
      title: "Looking for Valorant team - Diamond rank",
      author: "SharpShooter",
      avatar: "👤",
      content: "Diamond player looking for consistent team for ranked grind...",
      likes: 34,
      replies: 12,
      tags: ["Valorant", "LFG", "Competitive"],
      timeAgo: "6 hours ago",
      trending: false
    }
  ];

  const events = [
    {
      id: 1,
      title: "GameVault Tournament 2024",
      date: "Dec 15, 2024",
      participants: 2847,
      prize: "$50,000",
      status: "Registration Open",
      game: "Valorant"
    },
    {
      id: 2,
      title: "Speedrun Saturday",
      date: "Every Saturday",
      participants: 156,
      prize: "Glory",
      status: "Weekly Event",
      game: "Various"
    }
  ];

  const leaderboard = [
    { rank: 1, name: "ProGamer2024", points: 15420, badge: "🏆" },
    { rank: 2, name: "ElitePlayer", points: 14890, badge: "🥈" },
    { rank: 3, name: "GameMaster", points: 14567, badge: "🥉" },
    { rank: 4, name: "SkillLord", points: 13998, badge: "" },
    { rank: 5, name: "VictorySeeker", points: 13776, badge: "" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Community Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Community Hub</h1>
              <p className="text-muted-foreground">Connect, compete, and collaborate with fellow gamers</p>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary-hover">
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </div>
          
          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">247K</div>
                <div className="text-sm text-muted-foreground">Members</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <MessageSquare className="h-6 w-6 mx-auto mb-2 text-accent" />
                <div className="text-2xl font-bold">1.2M</div>
                <div className="text-sm text-muted-foreground">Discussions</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="h-6 w-6 mx-auto mb-2 text-gaming-warning" />
                <div className="text-2xl font-bold">856</div>
                <div className="text-sm text-muted-foreground">Tournaments</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-gaming-success" />
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="discussions" className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList className="grid w-fit grid-cols-3">
                  <TabsTrigger value="discussions">Discussions</TabsTrigger>
                  <TabsTrigger value="events">Events</TabsTrigger>
                  <TabsTrigger value="guides">Guides</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search community..." className="pl-10 w-64" />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>

              <TabsContent value="discussions" className="mt-0">
                <div className="space-y-4">
                  {discussionPosts.map((post) => (
                    <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="text-2xl">{post.avatar}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{post.title}</h3>
                              {post.trending && (
                                <Badge variant="secondary" className="bg-accent/20 text-accent">
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  Trending
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                              <span>by {post.author}</span>
                              <span>•</span>
                              <span>{post.timeAgo}</span>
                            </div>
                            
                            <p className="text-muted-foreground mb-4">{post.content}</p>
                            
                            <div className="flex items-center gap-4 mb-4">
                              {post.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                              <Button variant="ghost" size="sm" className="p-0 h-auto">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                {post.likes}
                              </Button>
                              <Button variant="ghost" size="sm" className="p-0 h-auto">
                                <MessageCircle className="h-4 w-4 mr-1" />
                                {post.replies} replies
                              </Button>
                              <Button variant="ghost" size="sm" className="p-0 h-auto">
                                <Share2 className="h-4 w-4 mr-1" />
                                Share
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="events">
                <div className="space-y-4">
                  {events.map((event) => (
                    <Card key={event.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>📅 {event.date}</span>
                              <span>👥 {event.participants} participants</span>
                              <span>🏆 {event.prize}</span>
                            </div>
                          </div>
                          <Badge 
                            variant={event.status === "Registration Open" ? "default" : "secondary"}
                            className="text-sm"
                          >
                            {event.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{event.game}</Badge>
                          <Button size="sm">Join Event</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="guides">
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Community Guides Coming Soon</h3>
                  <p className="text-muted-foreground">Expert guides and tutorials from our community will be available here</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-gaming-warning" />
                  Community Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((player) => (
                    <div key={player.rank} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium w-6">#{player.rank}</span>
                        <span className="text-lg">{player.badge}</span>
                        <span className="font-medium">{player.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{player.points.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Discussion
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Host Event
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Find Teams
                </Button>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle>Trending Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {["#EldenRing", "#GenshinImpact", "#Valorant", "#Speedrun", "#Tournament"].map((topic) => (
                    <Badge key={topic} variant="secondary" className="mr-2 mb-2">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
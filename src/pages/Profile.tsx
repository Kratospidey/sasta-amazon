import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Settings, 
  Shield, 
  Bell,
  CreditCard,
  Users,
  Trophy,
  Clock,
  Star,
  Edit3,
  Camera,
  Save,
  X,
  Check,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Gamepad2,
  Crown,
  Target,
  Activity,
  TrendingUp,
  Award,
  Zap,
  Gift,
  MessageSquare,
  Link2,
  Globe
} from "lucide-react";
import Header from "@/components/layout/Header";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "ProGamer2024",
    email: "progamer@gamevault.com",
    displayName: "Elite Gamer",
    bio: "Professional esports player and content creator. Specializing in FPS and MOBA games. Always pushing the limits and seeking new challenges in the gaming world!",
    location: "Los Angeles, CA",
    birthDate: "1995-03-15",
    profileImage: "/api/placeholder/120/120",
    bannerImage: "",
    discordTag: "EliteGamer#1234",
    twitchUsername: "elitegamer2024",
    steamId: "elitegamer_steam",
    website: "https://elitegamer.com"
  });

  const [notifications, setNotifications] = useState({
    gameUpdates: true,
    achievements: true,
    social: false,
    marketing: false,
    newsletter: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    gameActivity: true,
    achievements: true,
    friendsList: false,
    onlineStatus: true
  });

  const stats = {
    totalPlaytime: "2,847 hours",
    gamesOwned: 247,
    achievements: 2847,
    totalAchievements: 3456,
    friendsCount: 189,
    joinDate: "January 2020",
    level: 87,
    experience: 185420,
    nextLevelXp: 200000,
    winRate: 78,
    currentStreak: 12,
    bestStreak: 24,
    favoriteGenre: "FPS"
  };

  const recentAchievements = [
    {
      id: 1,
      game: "Valorant",
      name: "Radiant Ascension",
      description: "Reached Radiant rank in competitive",
      rarity: "Legendary",
      unlockedAt: "12 hours ago",
      icon: "🏆",
      xp: 500
    },
    {
      id: 2,
      game: "Elden Ring",
      name: "Lord of the Ring",
      description: "Defeated all major bosses without summons",
      rarity: "Ultra Rare",
      unlockedAt: "2 days ago", 
      icon: "👑",
      xp: 350
    },
    {
      id: 3,
      game: "League of Legends",
      name: "Pentakill Master",
      description: "Achieved 10 pentakills in ranked games",
      rarity: "Epic",
      unlockedAt: "1 week ago",
      icon: "⚔️",
      xp: 250
    },
    {
      id: 4,
      game: "Cyberpunk 2077",
      name: "Night City Legend",
      description: "Completed all side quests and gigs",
      rarity: "Rare",
      unlockedAt: "2 weeks ago",
      icon: "🌃",
      xp: 200
    }
  ];

  const friendsList = [
    { id: 1, name: "ShadowNinja", status: "online", game: "Playing Valorant", avatar: "🥷", level: 45 },
    { id: 2, name: "GamerQueen", status: "online", game: "Playing Elden Ring", avatar: "👸", level: 62 },
    { id: 3, name: "DragonSlayer", status: "away", game: "Away", avatar: "🐉", level: 38 },
    { id: 4, name: "CyberPunk", status: "offline", lastSeen: "2 hours ago", avatar: "🤖", level: 71 }
  ];

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Legendary": return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "Ultra Rare": return "text-purple-400 bg-purple-500/20 border-purple-500/30";
      case "Epic": return "text-orange-400 bg-orange-500/20 border-orange-500/30";
      case "Rare": return "text-blue-400 bg-blue-500/20 border-blue-500/30";
      case "Common": return "text-green-400 bg-green-500/20 border-green-500/30";
      default: return "text-gray-400 bg-gray-500/20 border-gray-500/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "offline": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const experienceProgress = (stats.experience / stats.nextLevelXp) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Profile Header */}
        <Card className="mb-8 overflow-hidden">
          <div className="relative">
            {/* Enhanced Banner with gradient and patterns */}
            <div className="h-48 md:h-64 bg-gradient-to-br from-primary via-accent to-primary relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 w-4 h-4 bg-white rounded-full animate-pulse"></div>
                <div className="absolute top-20 right-20 w-2 h-2 bg-white rounded-full animate-ping"></div>
                <div className="absolute bottom-20 left-32 w-3 h-3 bg-white rounded-full animate-pulse delay-300"></div>
                <div className="absolute top-32 right-40 w-2 h-2 bg-white rounded-full animate-ping delay-500"></div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-4 right-4 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <Camera className="h-4 w-4 mr-2" />
                Change Banner
              </Button>
            </div>
            
            {/* Profile Info */}
            <CardContent className="pt-0 pb-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-end gap-8 -mt-20 md:-mt-16">
                {/* Enhanced Avatar */}
                <div className="relative group">
                  <Avatar className="w-32 h-32 border-4 border-background shadow-2xl">
                    <AvatarImage src={profileData.profileImage} />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-accent text-white">
                      {profileData.displayName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="absolute bottom-2 right-2 rounded-full w-10 h-10 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                  <Badge className="absolute -top-2 -right-2 bg-primary">
                    <Crown className="h-3 w-3 mr-1" />
                    {stats.level}
                  </Badge>
                </div>
                
                {/* Enhanced Basic Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {profileData.displayName}
                      </h1>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="border-primary/50">
                          <Zap className="h-3 w-3 mr-1" />
                          Pro
                        </Badge>
                        <Badge variant="outline" className="border-accent/50">
                          <Trophy className="h-3 w-3 mr-1" />
                          Top 1%
                        </Badge>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-1">@{profileData.username}</p>
                    <p className="text-sm mb-4 max-w-2xl">{profileData.bio}</p>
                    
                    {/* Quick Links */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {profileData.location}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Joined {stats.joinDate}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Activity className="h-4 w-4" />
                        {stats.winRate}% win rate
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Level Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Level {stats.level} Progress</span>
                      <span className="text-muted-foreground">
                        {stats.experience.toLocaleString()} / {stats.nextLevelXp.toLocaleString()} XP
                      </span>
                    </div>
                    <div className="relative">
                      <Progress value={experienceProgress} className="h-3" />
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Enhanced Quick Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-3 bg-gaming-surface rounded-lg">
                      <div className="text-xl font-bold text-primary">{stats.gamesOwned}</div>
                      <div className="text-xs text-muted-foreground">Games</div>
                    </div>
                    <div className="text-center p-3 bg-gaming-surface rounded-lg">
                      <div className="text-xl font-bold text-accent">{stats.achievements}</div>
                      <div className="text-xs text-muted-foreground">Achievements</div>
                    </div>
                    <div className="text-center p-3 bg-gaming-surface rounded-lg">
                      <div className="text-xl font-bold text-gaming-success">{stats.friendsCount}</div>
                      <div className="text-xs text-muted-foreground">Friends</div>
                    </div>
                    <div className="text-center p-3 bg-gaming-surface rounded-lg">
                      <div className="text-xl font-bold text-gaming-warning">{stats.currentStreak}</div>
                      <div className="text-xs text-muted-foreground">Win Streak</div>
                    </div>
                    <div className="text-center p-3 bg-gaming-surface rounded-lg">
                      <div className="text-xl font-bold">{stats.totalPlaytime}</div>
                      <div className="text-xs text-muted-foreground">Played</div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Actions */}
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <Button 
                      variant={isEditing ? "destructive" : "outline"}
                      onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                      className="transition-all hover:scale-105"
                    >
                      {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                    {isEditing && (
                      <Button onClick={handleSave} className="transition-all hover:scale-105">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="hover:scale-105 transition-all">
                    <Gift className="h-4 w-4 mr-2" />
                    Send Gift
                  </Button>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-8">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="achievements" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Achievements
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Activity
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Enhanced Profile Details */}
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isEditing ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Display Name</label>
                            <Input 
                              value={profileData.displayName}
                              onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                              className="border-primary/20 focus:border-primary"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Username</label>
                            <Input 
                              value={profileData.username}
                              onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                              className="border-primary/20 focus:border-primary"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input 
                              type="email"
                              value={profileData.email}
                              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                              className="border-primary/20 focus:border-primary"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Location</label>
                            <Input 
                              value={profileData.location}
                              onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                              className="border-primary/20 focus:border-primary"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Discord</label>
                            <Input 
                              value={profileData.discordTag}
                              onChange={(e) => setProfileData({...profileData, discordTag: e.target.value})}
                              className="border-primary/20 focus:border-primary"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Website</label>
                            <Input 
                              value={profileData.website}
                              onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                              className="border-primary/20 focus:border-primary"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Bio</label>
                          <Textarea 
                            value={profileData.bio}
                            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                            rows={4}
                            className="border-primary/20 focus:border-primary"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-3 bg-gaming-surface rounded-lg">
                            <Mail className="h-5 w-5 text-primary" />
                            <div>
                              <div className="text-sm text-muted-foreground">Email</div>
                              <div className="font-medium">{profileData.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gaming-surface rounded-lg">
                            <MessageSquare className="h-5 w-5 text-accent" />
                            <div>
                              <div className="text-sm text-muted-foreground">Discord</div>
                              <div className="font-medium">{profileData.discordTag}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gaming-surface rounded-lg">
                            <Gamepad2 className="h-5 w-5 text-gaming-success" />
                            <div>
                              <div className="text-sm text-muted-foreground">Steam</div>
                              <div className="font-medium">{profileData.steamId}</div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-3 bg-gaming-surface rounded-lg">
                            <MapPin className="h-5 w-5 text-gaming-warning" />
                            <div>
                              <div className="text-sm text-muted-foreground">Location</div>
                              <div className="font-medium">{profileData.location}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gaming-surface rounded-lg">
                            <Calendar className="h-5 w-5 text-purple-400" />
                            <div>
                              <div className="text-sm text-muted-foreground">Member Since</div>
                              <div className="font-medium">{stats.joinDate}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gaming-surface rounded-lg">
                            <Globe className="h-5 w-5 text-blue-400" />
                            <div>
                              <div className="text-sm text-muted-foreground">Website</div>
                              <div className="font-medium text-primary cursor-pointer hover:underline">
                                {profileData.website}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Enhanced Gaming Stats */}
                <Card className="border-accent/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gamepad2 className="h-5 w-5" />
                      Gaming Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <Gamepad2 className="h-10 w-10 mx-auto mb-3 text-primary" />
                        <div className="text-3xl font-bold">{stats.gamesOwned}</div>
                        <div className="text-sm text-muted-foreground">Games Owned</div>
                      </div>
                      <div className="text-center p-4 bg-gaming-warning/5 rounded-lg border border-gaming-warning/20">
                        <Trophy className="h-10 w-10 mx-auto mb-3 text-gaming-warning" />
                        <div className="text-3xl font-bold">{stats.achievements}</div>
                        <div className="text-sm text-muted-foreground">Achievements</div>
                      </div>
                      <div className="text-center p-4 bg-accent/5 rounded-lg border border-accent/20">
                        <Clock className="h-10 w-10 mx-auto mb-3 text-accent" />
                        <div className="text-3xl font-bold">{stats.totalPlaytime}</div>
                        <div className="text-sm text-muted-foreground">Total Playtime</div>
                      </div>
                      <div className="text-center p-4 bg-gaming-success/5 rounded-lg border border-gaming-success/20">
                        <Users className="h-10 w-10 mx-auto mb-3 text-gaming-success" />
                        <div className="text-3xl font-bold">{stats.friendsCount}</div>
                        <div className="text-sm text-muted-foreground">Friends</div>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <div className="text-xl font-bold">{stats.winRate}%</div>
                        <div className="text-sm text-muted-foreground">Win Rate</div>
                      </div>
                      <div className="text-center">
                        <Target className="h-8 w-8 mx-auto mb-2 text-accent" />
                        <div className="text-xl font-bold">{stats.currentStreak}</div>
                        <div className="text-sm text-muted-foreground">Current Streak</div>
                      </div>
                      <div className="text-center">
                        <Award className="h-8 w-8 mx-auto mb-2 text-gaming-warning" />
                        <div className="text-xl font-bold">{stats.bestStreak}</div>
                        <div className="text-sm text-muted-foreground">Best Streak</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Recent Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentAchievements.map((achievement) => (
                        <div key={achievement.id} className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-gaming-surface/50 transition-colors">
                          <div className="text-3xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-lg">{achievement.name}</h4>
                              <Badge className={`${getRarityColor(achievement.rarity)} border`}>
                                {achievement.rarity}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                +{achievement.xp} XP
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-2">{achievement.description}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="secondary" className="text-xs">
                                {achievement.game}
                              </Badge>
                              <span>•</span>
                              <span>{achievement.unlockedAt}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center py-8 text-muted-foreground">
                        <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Activity tracking coming soon!</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                {/* Notification Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-gaming-surface rounded-lg">
                        <div>
                          <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <p className="text-sm text-muted-foreground">
                            {key === 'gameUpdates' && 'Get notified about game updates and patches'}
                            {key === 'achievements' && 'Get notified when you unlock achievements'}
                            {key === 'social' && 'Get notified about friend requests and messages'}
                            {key === 'marketing' && 'Receive promotional emails and offers'}
                            {key === 'newsletter' && 'Subscribe to our gaming newsletter'}
                          </p>
                        </div>
                        <Switch 
                          checked={value}
                          onCheckedChange={(checked) => 
                            setNotifications({...notifications, [key]: checked})
                          }
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Privacy Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Privacy Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries(privacy).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-gaming-surface rounded-lg">
                        <div>
                          <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <p className="text-sm text-muted-foreground">
                            {key === 'profileVisibility' && 'Control who can see your profile'}
                            {key === 'gameActivity' && 'Show your gaming activity to others'}
                            {key === 'achievements' && 'Display your achievements publicly'}
                            {key === 'friendsList' && 'Show your friends list to others'}
                            {key === 'onlineStatus' && 'Display when you\'re online'}
                          </p>
                        </div>
                        <Switch 
                          checked={typeof value === 'boolean' ? value : true}
                          onCheckedChange={(checked) => 
                            setPrivacy({...privacy, [key]: checked})
                          }
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Account Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="h-4 w-4 mr-2" />
                        Enable Two-Factor Authentication
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Manage Payment Methods
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Enhanced Friends List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Friends ({friendsList.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {friendsList.map((friend) => (
                    <div key={friend.id} className="flex items-center justify-between p-3 bg-gaming-surface rounded-lg hover:bg-gaming-surface-hover transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-lg">
                            {friend.avatar}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(friend.status)}`}></div>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{friend.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {friend.status === 'online' ? friend.game : friend.status === 'offline' ? friend.lastSeen : 'Away'}
                          </p>
                          <Badge variant="outline" className="text-xs mt-1">
                            Lv. {friend.level}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Users className="h-4 w-4 mr-2" />
                  View All Friends
                </Button>
              </CardContent>
            </Card>

            {/* Achievement Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Achievement Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Progress</span>
                      <span>{Math.round((stats.achievements / stats.totalAchievements) * 100)}%</span>
                    </div>
                    <Progress value={(stats.achievements / stats.totalAchievements) * 100} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gaming-warning">{stats.achievements}</div>
                      <div className="text-xs text-muted-foreground">Unlocked</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-muted-foreground">{stats.totalAchievements - stats.achievements}</div>
                      <div className="text-xs text-muted-foreground">Remaining</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
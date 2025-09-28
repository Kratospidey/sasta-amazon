import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  Target
} from "lucide-react";
import Header from "@/components/layout/Header";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "ProGamer2024",
    email: "progamer@gamevault.com",
    displayName: "Pro Gamer",
    bio: "Passionate gamer with over 10 years of experience. Love RPGs, FPS, and indie games. Always looking for new challenges!",
    location: "New York, USA",
    birthDate: "1995-03-15",
    profileImage: "👤",
    bannerImage: "",
    discordTag: "ProGamer#1234",
    twitchUsername: "progamer2024",
    steamId: "progamer_steam"
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
    totalPlaytime: "1,247 hours",
    gamesOwned: 156,
    achievements: 1847,
    totalAchievements: 2456,
    friendsCount: 89,
    joinDate: "January 2020",
    level: 47,
    experience: 75420,
    nextLevelXp: 80000
  };

  const recentAchievements = [
    {
      id: 1,
      game: "Elden Ring",
      name: "Master Explorer",
      description: "Discovered all major locations",
      rarity: "Ultra Rare",
      unlockedAt: "2 days ago",
      icon: "🏆"
    },
    {
      id: 2,
      game: "Valorant",
      name: "Ace in the Hole",
      description: "Got an ace in ranked match",
      rarity: "Rare",
      unlockedAt: "1 week ago",
      icon: "🎯"
    },
    {
      id: 3,
      game: "Genshin Impact",
      name: "Artifact Hunter",
      description: "Collected 100 5-star artifacts",
      rarity: "Epic",
      unlockedAt: "2 weeks ago",
      icon: "💎"
    }
  ];

  const friendsList = [
    { id: 1, name: "GamerFriend1", status: "online", game: "Playing Valorant" },
    { id: 2, name: "ElitePlayer", status: "offline", lastSeen: "2 hours ago" },
    { id: 3, name: "ProMaster", status: "online", game: "Playing Elden Ring" },
    { id: 4, name: "SkillLord", status: "away", game: "Away" }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Ultra Rare": return "text-purple-400 bg-purple-500/20";
      case "Epic": return "text-orange-400 bg-orange-500/20";
      case "Rare": return "text-blue-400 bg-blue-500/20";
      case "Common": return "text-green-400 bg-green-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  const experienceProgress = (stats.experience / stats.nextLevelXp) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <div className="relative">
            {/* Banner */}
            <div className="h-32 md:h-48 bg-gradient-to-r from-primary to-accent rounded-t-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20" />
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-4 right-4 text-white hover:bg-white/20"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Profile Info */}
            <CardContent className="pt-0 pb-6">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 md:-mt-12">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-card border-4 border-background rounded-full flex items-center justify-center text-4xl md:text-5xl shadow-lg">
                    {profileData.profileImage}
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Basic Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold">{profileData.displayName}</h1>
                    <Badge className="bg-primary/20 text-primary">
                      <Crown className="h-3 w-3 mr-1" />
                      Level {stats.level}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-2">@{profileData.username}</p>
                  <p className="text-sm text-muted-foreground mb-4">{profileData.bio}</p>
                  
                  {/* Level Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Experience</span>
                      <span>{stats.experience.toLocaleString()} / {stats.nextLevelXp.toLocaleString()} XP</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                        style={{ width: `${experienceProgress}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold">{stats.gamesOwned}</div>
                      <div className="text-xs text-muted-foreground">Games</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{stats.achievements}</div>
                      <div className="text-xs text-muted-foreground">Achievements</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{stats.friendsCount}</div>
                      <div className="text-xs text-muted-foreground">Friends</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{stats.totalPlaytime}</div>
                      <div className="text-xs text-muted-foreground">Played</div>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    variant={isEditing ? "destructive" : "outline"}
                    onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                  >
                    {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                  {isEditing && (
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6">
                {/* Profile Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Display Name</label>
                            <Input 
                              value={profileData.displayName}
                              onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Username</label>
                            <Input 
                              value={profileData.username}
                              onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Email</label>
                            <Input 
                              type="email"
                              value={profileData.email}
                              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Location</label>
                            <Input 
                              value={profileData.location}
                              onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Bio</label>
                          <Textarea 
                            value={profileData.bio}
                            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                            rows={3}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{profileData.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{profileData.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Joined {stats.joinDate}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Gaming Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Gaming Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <Gamepad2 className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold">{stats.gamesOwned}</div>
                        <div className="text-sm text-muted-foreground">Games Owned</div>
                      </div>
                      <div className="text-center">
                        <Trophy className="h-8 w-8 mx-auto mb-2 text-gaming-warning" />
                        <div className="text-2xl font-bold">{stats.achievements}</div>
                        <div className="text-sm text-muted-foreground">Achievements</div>
                      </div>
                      <div className="text-center">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-accent" />
                        <div className="text-2xl font-bold">{stats.totalPlaytime}</div>
                        <div className="text-sm text-muted-foreground">Total Playtime</div>
                      </div>
                      <div className="text-center">
                        <Users className="h-8 w-8 mx-auto mb-2 text-gaming-success" />
                        <div className="text-2xl font-bold">{stats.friendsCount}</div>
                        <div className="text-sm text-muted-foreground">Friends</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentAchievements.map((achievement) => (
                        <div key={achievement.id} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{achievement.name}</h4>
                              <Badge className={getRarityColor(achievement.rarity)}>
                                {achievement.rarity}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{achievement.game}</span>
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

              <TabsContent value="settings" className="mt-6 space-y-6">
                {/* Notification Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
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
                    <CardTitle>Privacy Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(privacy).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <p className="text-sm text-muted-foreground">
                            {key === 'profileVisibility' && 'Control who can see your profile'}
                            {key === 'gameActivity' && 'Show your current game activity'}
                            {key === 'achievements' && 'Display your achievements publicly'}
                            {key === 'friendsList' && 'Show your friends list to others'}
                            {key === 'onlineStatus' && 'Display when you are online'}
                          </p>
                        </div>
                        {key === 'profileVisibility' ? (
                          <select 
                            value={value as string}
                            className="p-2 border border-border rounded bg-background"
                            onChange={(e) => setPrivacy({...privacy, [key]: e.target.value})}
                          >
                            <option value="public">Public</option>
                            <option value="friends">Friends Only</option>
                            <option value="private">Private</option>
                          </select>
                        ) : (
                          <Switch 
                            checked={value as boolean}
                            onCheckedChange={(checked) => 
                              setPrivacy({...privacy, [key]: checked})
                            }
                          />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security to your account</p>
                      <Button variant="outline">
                        <Shield className="h-4 w-4 mr-2" />
                        Enable 2FA
                      </Button>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Change Password</h4>
                      <p className="text-sm text-muted-foreground mb-4">Update your password regularly for better security</p>
                      <Button variant="outline">Change Password</Button>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Login Sessions</h4>
                      <p className="text-sm text-muted-foreground mb-4">Manage your active login sessions</p>
                      <Button variant="outline">View Sessions</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Friends List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Friends ({stats.friendsCount})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {friendsList.slice(0, 4).map((friend) => (
                    <div key={friend.id} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        friend.status === 'online' ? 'bg-gaming-success' :
                        friend.status === 'away' ? 'bg-gaming-warning' : 'bg-muted'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{friend.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {friend.game || friend.lastSeen || friend.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View All Friends
                </Button>
              </CardContent>
            </Card>

            {/* Achievement Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Achievement Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.achievements}</div>
                    <div className="text-sm text-muted-foreground">
                      of {stats.totalAchievements} achievements
                    </div>
                  </div>
                  
                  <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-gaming-warning to-accent transition-all duration-300"
                      style={{ width: `${(stats.achievements / stats.totalAchievements) * 100}%` }}
                    />
                  </div>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    {Math.round((stats.achievements / stats.totalAchievements) * 100)}% Complete
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Methods
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy & Security
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
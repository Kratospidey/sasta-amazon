import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  Settings, 
  Check,
  X,
  Gamepad2,
  Trophy,
  ShoppingCart,
  Users,
  Gift,
  Zap,
  MessageCircle,
  Calendar,
  Filter
} from "lucide-react";
import Header from "@/components/layout/Header";

interface Notification {
  id: string;
  type: 'game' | 'achievement' | 'social' | 'purchase' | 'system' | 'event';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionable?: boolean;
  gameImage?: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "achievement",
      title: "New Achievement Unlocked!",
      message: "You've unlocked 'Master Explorer' in Elden Ring",
      timestamp: "5 minutes ago",
      read: false,
      gameImage: "/game-1.jpg"
    },
    {
      id: "2",
      type: "game",
      title: "Game Update Available",
      message: "Valorant Episode 8 Act 1 is now available for download",
      timestamp: "1 hour ago",
      read: false,
      actionable: true,
      gameImage: "/game-3.jpg"
    },
    {
      id: "3",
      type: "social",
      title: "Friend Request",
      message: "ProGamer2024 wants to be your friend",
      timestamp: "2 hours ago",
      read: false,
      actionable: true
    },
    {
      id: "4",
      type: "purchase",
      title: "Purchase Confirmation",
      message: "Your purchase of Genshin Impact - Welkin Moon has been confirmed",
      timestamp: "3 hours ago",
      read: true,
      gameImage: "/game-2.jpg"
    },
    {
      id: "5",
      type: "event",
      title: "Tournament Starting Soon",
      message: "GameVault Championship starts in 30 minutes. Don't miss out!",
      timestamp: "4 hours ago",
      read: false,
      actionable: true
    },
    {
      id: "6",
      type: "system",
      title: "Security Alert",
      message: "New login detected from Chrome on Windows",
      timestamp: "6 hours ago",
      read: true
    },
    {
      id: "7",
      type: "game",
      title: "Free Game Available",
      message: "Claim your free copy of Epic Adventures before it expires",
      timestamp: "1 day ago",
      read: true,
      actionable: true
    }
  ]);

  const [filter, setFilter] = useState<string>("all");

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'game': return <Gamepad2 className="h-5 w-5 text-primary" />;
      case 'achievement': return <Trophy className="h-5 w-5 text-gaming-warning" />;
      case 'social': return <Users className="h-5 w-5 text-accent" />;
      case 'purchase': return <ShoppingCart className="h-5 w-5 text-gaming-success" />;
      case 'system': return <Settings className="h-5 w-5 text-muted-foreground" />;
      case 'event': return <Calendar className="h-5 w-5 text-gaming-glow" />;
      default: return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'game': return 'Game';
      case 'achievement': return 'Achievement';
      case 'social': return 'Social';
      case 'purchase': return 'Purchase';
      case 'system': return 'System';
      case 'event': return 'Event';
      default: return 'Other';
    }
  };

  const filteredNotifications = filter === "all" 
    ? notifications 
    : notifications.filter(notif => notif.type === filter);

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Notifications</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : "You're all caught up!"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filter Tabs */}
            <Tabs value={filter} onValueChange={setFilter} className="w-full mb-6">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="game">Games</TabsTrigger>
                <TabsTrigger value="achievement">Achievements</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
                <TabsTrigger value="purchase">Purchases</TabsTrigger>
                <TabsTrigger value="event">Events</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Notifications List */}
            <div className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                    <p className="text-muted-foreground">
                      {filter === "all" ? "You're all caught up!" : `No ${getTypeName(filter).toLowerCase()} notifications`}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`transition-all hover:shadow-md ${
                      !notification.read ? 'border-primary/50 bg-primary/5' : ''
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-1">
                          {getTypeIcon(notification.type)}
                        </div>
                        
                        {/* Game Image (if available) */}
                        {notification.gameImage && (
                          <img 
                            src={notification.gameImage} 
                            alt=""
                            className="w-12 h-16 object-cover rounded flex-shrink-0"
                          />
                        )}
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{notification.title}</h3>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {getTypeName(notification.type)}
                              </Badge>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground mb-3">{notification.message}</p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{notification.timestamp}</span>
                            
                            <div className="flex items-center gap-2">
                              {notification.actionable && (
                                <Button size="sm" variant="outline">
                                  {notification.type === 'social' ? 'Accept' : 
                                   notification.type === 'game' ? 'Download' :
                                   notification.type === 'event' ? 'Join' : 'View'}
                                </Button>
                              )}
                              {!notification.read && (
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-primary"
                                >
                                  Mark as read
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notification Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total</span>
                    <Badge variant="secondary">{notifications.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Unread</span>
                    <Badge variant="destructive">{unreadCount}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Actionable</span>
                    <Badge variant="default">
                      {notifications.filter(n => n.actionable && !n.read).length}
                    </Badge>
                  </div>
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
                  <Settings className="h-4 w-4 mr-2" />
                  Notification Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Filter className="h-4 w-4 mr-2" />
                  Manage Filters
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Push Notifications
                </Button>
              </CardContent>
            </Card>

            {/* Notification Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['game', 'achievement', 'social', 'purchase', 'event', 'system'].map((type) => {
                    const count = notifications.filter(n => n.type === type).length;
                    const unreadForType = notifications.filter(n => n.type === type && !n.read).length;
                    
                    return (
                      <div 
                        key={type}
                        className="flex items-center justify-between p-2 rounded hover:bg-gaming-surface cursor-pointer"
                        onClick={() => setFilter(type)}
                      >
                        <div className="flex items-center gap-2">
                          {getTypeIcon(type)}
                          <span className="text-sm">{getTypeName(type)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">{count}</Badge>
                          {unreadForType > 0 && (
                            <Badge variant="destructive" className="text-xs">{unreadForType}</Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
import { useState } from "react";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useTracker } from "@/contexts/TrackerContext";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import type { Achievement } from "@/lib/trackerTypes";
import { Loader2 } from "lucide-react";

const achievementCategoryLabels: Record<Achievement["category"], string> = {
  library: "Library milestones",
  playtime: "Playtime goals",
  engagement: "Engagement streaks",
  social: "Social sharing",
};

const Profile = () => {
  const { user, login, register, logout, updateProfile, loading, beginLogin, usingOpenAuth } = useAuth();
  const { lists, listItems, achievements, achievementUnlocks, activity } = useTracker();
  const [formState, setFormState] = useState({
    displayName: user?.displayName ?? "",
    bio: user?.bio ?? "",
    privacy: user?.privacy ?? "friends",
  });
  const [loginState, setLoginState] = useState({ email: "demo@gamevault.dev", password: "demo" });
  const [registerState, setRegisterState] = useState({ email: "", password: "", displayName: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [providerHint, setProviderHint] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  const userLists = user ? lists.filter((list) => list.userId === user.id) : [];
  const userItems = user
    ? listItems.filter((item) => userLists.some((list) => list.id === item.listId))
    : [];
  const hoursTracked = userItems.reduce((total, item) => total + item.playtimeMinutes, 0) / 60;
  const unlocked = user
    ? achievementUnlocks.filter((unlock) => unlock.userId === user.id)
    : [];
  const recentActivity = user
    ? activity.filter((event) => event.userId === user.id).slice(0, 4)
    : [];


  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await login(loginState.email, loginState.password);
      toast.success("Welcome back!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to sign in");
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await register(registerState);
      toast.success("Account created");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to register");
    }
  };

  const handleOpenAuthLogin = async () => {
    setIsRedirecting(true);
    try {
      await beginLogin({ provider: providerHint.trim() || undefined });
    } catch (error) {
      setIsRedirecting(false);
      toast.error(error instanceof Error ? error.message : "Unable to start OpenAuth sign-in");
    }
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      await updateProfile(formState);
      toast.success("Profile updated");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">Loading profile...</CardContent>
          </Card>
        ) : !user ? (
          <Card>
            <CardHeader>
              <CardTitle>Access your tracker</CardTitle>
              <CardDescription>
                {usingOpenAuth
                  ? "Securely sign in with your Supabase OpenAuth provider."
                  : "Sign in with the demo account or create a new profile."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {usingOpenAuth ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    You will be redirected to complete authentication. Configure your providers in Supabase and
                    optionally specify one below.
                  </p>
                  <Input
                    value={providerHint}
                    onChange={(event) => setProviderHint(event.target.value)}
                    placeholder="Optional provider (e.g. google, github)"
                    disabled={isRedirecting}
                  />
                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleOpenAuthLogin}
                    disabled={isRedirecting}
                  >
                    {isRedirecting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Redirecting...
                      </span>
                    ) : (
                      "Continue with OpenAuth"
                    )}
                  </Button>
                </div>
              ) : (
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login" className="space-y-4 pt-4">
                    <form onSubmit={handleLogin} className="space-y-3">
                      <Input
                        type="email"
                        value={loginState.email}
                        onChange={(event) => setLoginState((prev) => ({ ...prev, email: event.target.value }))}
                        placeholder="Email"
                        required
                      />
                      <Input
                        type="password"
                        value={loginState.password}
                        onChange={(event) => setLoginState((prev) => ({ ...prev, password: event.target.value }))}
                        placeholder="Password"
                        required
                      />
                      <Button type="submit" className="w-full">
                        Sign in
                      </Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="register" className="space-y-4 pt-4">
                    <form onSubmit={handleRegister} className="space-y-3">
                      <Input
                        value={registerState.displayName}
                        onChange={(event) =>
                          setRegisterState((prev) => ({ ...prev, displayName: event.target.value }))
                        }
                        placeholder="Display name"
                        required
                      />
                      <Input
                        type="email"
                        value={registerState.email}
                        onChange={(event) => setRegisterState((prev) => ({ ...prev, email: event.target.value }))}
                        placeholder="Email"
                        required
                      />
                      <Input
                        type="password"
                        value={registerState.password}
                        onChange={(event) => setRegisterState((prev) => ({ ...prev, password: event.target.value }))}
                        placeholder="Password"
                        required
                      />
                      <Button type="submit" className="w-full">
                        Create account
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-6">
            <section className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>{user.displayName}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>{user.bio || "Add a short bio to introduce yourself."}</p>
                  <Badge variant="outline" className="capitalize">
                    Privacy: {user.privacy}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Library stats</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Hours tracked</span>
                    <span className="font-semibold">{hoursTracked.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Games tracked</span>
                    <span className="font-semibold">{userItems.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Lists maintained</span>
                    <span className="font-semibold">{userLists.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Achievements unlocked</span>
                    <span className="font-semibold">{unlocked.length}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Recent achievements</CardTitle>
                  <CardDescription>Latest unlocks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  {unlocked.length === 0 ? (
                    <p>No achievements unlocked yet.</p>
                  ) : (
                    unlocked
                      .slice(0, 3)
                      .map((unlock) => {
                        const achievement = achievements.find((candidate) => candidate.id === unlock.achievementId);
                        if (!achievement) return null;
                        return (
                          <div key={unlock.id} className="flex flex-col gap-1">
                            <span className="font-medium text-foreground">{achievement.name}</span>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">
                                {achievementCategoryLabels[achievement.category]}
                              </span>
                              <span>{formatDistanceToNow(new Date(unlock.unlockedAt))} ago</span>
                            </div>
                          </div>
                        );
                      })
                  )}
                </CardContent>
              </Card>
            </section>

            <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Edit profile</CardTitle>
                  <CardDescription>Control how your tracker profile appears to others.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={handleSave}>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Display name</label>
                      <Input
                        value={formState.displayName}
                        onChange={(event) => setFormState((prev) => ({ ...prev, displayName: event.target.value }))}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Bio</label>
                      <Textarea
                        value={formState.bio}
                        onChange={(event) => setFormState((prev) => ({ ...prev, bio: event.target.value }))}
                        rows={4}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Privacy</label>
                      <Select
                        value={formState.privacy}
                        onValueChange={(value) => setFormState((prev) => ({ ...prev, privacy: value as typeof prev.privacy }))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Privacy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="friends">Friends</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  {recentActivity.length === 0 ? (
                    <p>No recent activity.</p>
                  ) : (
                    recentActivity.map((event) => (
                      <div key={event.id} className="flex items-center justify-between gap-3">
                        <span className="text-foreground">{event.title}</span>
                        <span>{formatDistanceToNow(new Date(event.createdAt))} ago</span>
                      </div>
                    ))
                  )}
                  <Progress value={(unlocked.length / Math.max(achievements.length, 1)) * 100} />
                  <p className="text-xs">Overall achievement completion</p>
                </CardContent>
              </Card>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;

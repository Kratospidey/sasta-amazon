import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Bell, Gamepad2, ListChecks, Menu, Trophy, User, Compass, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Dashboard", icon: Compass, requiresAuth: false },
  { to: "/games", label: "Games", icon: Gamepad2, requiresAuth: false },
  { to: "/lists", label: "Library", icon: ListChecks, requiresAuth: true },
  { to: "/achievements", label: "Achievements", icon: Trophy, requiresAuth: true },
  { to: "/activity", label: "Activity", icon: Bell, requiresAuth: true },
];

const Header = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = search.trim();
    if (!trimmed) return;
    navigate(`/games?query=${encodeURIComponent(trimmed)}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <Gamepad2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold hidden sm:inline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              GameVault Tracker
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItems
            .filter((item) => (item.requiresAuth ? Boolean(user) : true))
            .map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <form onSubmit={handleSearchSubmit} className="hidden sm:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <label htmlFor="global-search" className="sr-only">
              {user ? "Search your library" : "Search games"}
            </label>
            <Input
              id="global-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={user ? "Search your library..." : "Search games..."}
              aria-label={user ? "Search your library" : "Search games"}
              className="bg-gaming-surface border-border pr-10"
            />
            {search && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {user && (
            <Button
              variant={location.pathname === "/activity" ? "secondary" : "ghost"}
              size="sm"
              className="sm:hidden"
              onClick={() => navigate("/activity")}
              aria-label="Open activity feed"
            >
              <Bell className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline text-sm font-medium">
              {user ? user.displayName : "Sign in"}
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

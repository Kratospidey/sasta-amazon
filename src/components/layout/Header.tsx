import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Bell, Gamepad2, ListChecks, Menu, Trophy, User, Compass } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Dashboard", icon: Compass },
  { to: "/games", label: "Games", icon: Gamepad2 },
  { to: "/lists", label: "Lists", icon: ListChecks },
  { to: "/achievements", label: "Achievements", icon: Trophy },
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
          <Button variant="ghost" size="icon" className="md:hidden">
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
          {navItems.map((item) => {
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
          <NavLink
            to="/activity"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`
            }
          >
            <Bell className="h-4 w-4" />
            Activity
          </NavLink>
        </nav>

        <form onSubmit={handleSearchSubmit} className="hidden sm:flex flex-1 max-w-md mx-4">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search your catalogue..."
            className="bg-gaming-surface border-border"
          />
        </form>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Button
            variant={location.pathname === "/activity" ? "secondary" : "ghost"}
            size="sm"
            className="sm:hidden"
            onClick={() => navigate("/activity")}
          >
            <Bell className="h-4 w-4" />
          </Button>

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

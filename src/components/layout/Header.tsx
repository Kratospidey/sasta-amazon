import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Bell,
  Menu,
  Gamepad2
} from "lucide-react";

const Header = () => {
  const [cartCount] = useState(3);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">

      {/* Main Header */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <Gamepad2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold hidden sm:inline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              GameVault
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Store
            </Button>
          </Link>
          <Link to="/library">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Library
            </Button>
          </Link>
          <Link to="/community">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Community
            </Button>
          </Link>
          <Link to="/support">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Support
            </Button>
          </Link>
        </nav>

        {/* Search */}
        <div className="flex-1 max-w-md mx-4 hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search games, genres, developers..." 
              className="pl-10 bg-gaming-surface border-border"
            />
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-2">
          <Link to="/notifications">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Bell className="h-4 w-4" />
            </Button>
          </Link>
          
          <Link to="/cart">
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>

          <Link to="/profile">
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
            </Button>
          </Link>

          <Button variant="default" size="sm" className="hidden sm:inline-flex">
            Login
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
import { useState, useRef, useEffect } from "react";
import { Search, X, Sparkles, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFilters } from "@/contexts/FilterContext";

interface SearchSuggestion {
  id: string;
  title: string;
  type: 'game' | 'genre' | 'studio';
  thumbnail?: string;
}

const SearchBar = () => {
  const { filters, setSearchTerm } = useFilters();
  const [query, setQuery] = useState(filters.searchTerm);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isHotSearch, setIsHotSearch] = useState(true);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock suggestions with our actual games
  const mockSuggestions: SearchSuggestion[] = [
    { id: '1', title: 'Elden Ring', type: 'game' },
    { id: '2', title: 'Genshin Impact', type: 'game' },
    { id: '3', title: 'Fortnite', type: 'game' },
    { id: '4', title: 'Valorant', type: 'game' },
    { id: '5', title: 'League of Legends', type: 'game' },
    { id: '6', title: 'Minecraft', type: 'game' },
    { id: '7', title: 'Cyberpunk 2077', type: 'game' },
    { id: '8', title: 'Among Us', type: 'game' },
    { id: '9', title: 'RPG', type: 'genre' },
    { id: '10', title: 'Battle Royale', type: 'genre' },
    { id: '11', title: 'FromSoftware', type: 'studio' },
    { id: '12', title: 'Riot Games', type: 'studio' },
  ];

  const trendingSearches = [
    'Elden Ring', 'Free Games', 'RPG', 'Multiplayer', 'On Sale'
  ];

  useEffect(() => {
    if (query.length > 0) {
      setIsHotSearch(false);
      const filtered = mockSuggestions.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 6));
      setShowSuggestions(true);
    } else {
      setIsHotSearch(true);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery("");
    setSearchTerm("");
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title);
    setSearchTerm(suggestion.title);
    setShowSuggestions(false);
  };

  const handleTrendingClick = (search: string) => {
    setQuery(search);
    setSearchTerm(search);
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSearchTerm(value);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'game': return '🎮';
      case 'genre': return '🏷️';
      case 'studio': return '🏢';
      default: return '🔍';
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto mb-8">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          type="text"
          placeholder="Search for your next adventure..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          className="pl-12 pr-10 h-14 text-base bg-gaming-surface border-border rounded-2xl shadow-lg focus:shadow-xl transition-all duration-300 hover:shadow-md focus:ring-2 focus:ring-primary/20"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 w-8 p-0 hover:bg-gaming-surface-hover rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in backdrop-blur-sm">
          {isHotSearch && trendingSearches.length > 0 && (
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Trending Now</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((search, index) => (
                  <Badge 
                    key={index}
                    variant="secondary" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleTrendingClick(search)}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {suggestions.length > 0 && (
            <div>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-gaming-surface transition-colors flex items-center gap-3 group"
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">{getTypeIcon(suggestion.type)}</span>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{suggestion.title}</div>
                    <div className="text-sm text-muted-foreground capitalize">{suggestion.type}</div>
                  </div>
                  <Search className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
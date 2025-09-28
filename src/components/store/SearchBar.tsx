import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchSuggestion {
  id: string;
  title: string;
  type: 'game' | 'genre' | 'studio';
  thumbnail?: string;
}

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock suggestions - in real app, this would come from API
  const mockSuggestions: SearchSuggestion[] = [
    { id: '1', title: 'Elden Ring', type: 'game', thumbnail: '/game-1.jpg' },
    { id: '2', title: 'Genshin Impact', type: 'game', thumbnail: '/game-2.jpg' },
    { id: '3', title: 'Fortnite', type: 'game', thumbnail: '/game-3.jpg' },
    { id: '4', title: 'Valorant', type: 'game', thumbnail: '/game-4.jpg' },
    { id: '5', title: 'Action', type: 'genre' },
    { id: '6', title: 'RPG', type: 'genre' },
    { id: '7', title: 'FromSoftware', type: 'studio' },
    { id: '8', title: 'Riot Games', type: 'studio' },
  ];

  useEffect(() => {
    if (query.length > 0) {
      const filtered = mockSuggestions.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 6));
      setShowSuggestions(true);
    } else {
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
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title);
    setShowSuggestions(false);
    // Handle search action here
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
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search games, genres, or studios..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 0 && setShowSuggestions(true)}
          className="pl-12 pr-10 h-12 text-base bg-gaming-surface border-border rounded-xl shadow-sm focus:shadow-md transition-all"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gaming-surface-hover"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden animate-fade-in">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gaming-surface transition-colors flex items-center gap-3"
            >
              <span className="text-lg">{getTypeIcon(suggestion.type)}</span>
              <div className="flex-1">
                <div className="font-medium text-foreground">{suggestion.title}</div>
                <div className="text-sm text-muted-foreground capitalize">{suggestion.type}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
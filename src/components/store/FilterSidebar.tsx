import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFilters } from "@/contexts/FilterContext";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, X, Filter, Sparkles, DollarSign, Grid3X3, Tag } from "lucide-react";

const FilterSidebar = () => {
  const { 
    filters, 
    toggleGenre, 
    setPriceRange, 
    setSortBy, 
    toggleFreeOnly, 
    toggleOnSaleOnly, 
    clearFilters 
  } = useFilters();

  const genres = [
    "Action", "Adventure", "RPG", "Shooter", "Strategy", "Simulation", 
    "Sports", "Racing", "Horror", "Puzzle", "Platformer", "Indie", "Multiplayer",
    "Open World", "Sci-Fi", "Fantasy", "Battle Royale", "MOBA", "Sandbox", 
    "Creative", "Cyberpunk", "Hero Shooter", "Tactical", "Anime", "Social", 
    "Deduction", "Party"
  ];

  const hasActiveFilters = filters.selectedGenres.length > 0 || 
    filters.showFreeOnly || filters.showOnSaleOnly || 
    filters.priceRange[0] > 0 || filters.priceRange[1] < 100;

  return (
    <div className="modern-filter-sidebar w-80 bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
      
      {/* Header */}
      <div className="relative p-6 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/5 border-b border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Filter className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Filters</h3>
        </div>
        
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-lg"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
        
        <p className="text-sm text-muted-foreground">
          Find your perfect game with precision
        </p>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Sort By */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4 text-primary" />
            <Label className="text-sm font-semibold text-foreground">Sort By</Label>
          </div>
          <Select value={filters.sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="bg-muted/50 border-white/20 hover:bg-muted/70 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-white/20 shadow-xl">
              <SelectItem value="popular">🔥 Most Popular</SelectItem>
              <SelectItem value="name">📝 Name A-Z</SelectItem>
              <SelectItem value="price-low">💰 Price: Low to High</SelectItem>
              <SelectItem value="price-high">💎 Price: High to Low</SelectItem>
              <SelectItem value="rating">⭐ Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-foreground">Active Filters</Label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar">
              {filters.selectedGenres.map(genre => (
                <Badge 
                  key={genre} 
                  className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors"
                >
                  {genre}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-red-400" 
                    onClick={() => toggleGenre(genre)}
                  />
                </Badge>
              ))}
              {filters.showFreeOnly && (
                <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                  Free Games
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={toggleFreeOnly} />
                </Badge>
              )}
              {filters.showOnSaleOnly && (
                <Badge className="bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  On Sale
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={toggleOnSaleOnly} />
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Price Range */}
        <Collapsible defaultOpen className="space-y-3">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-white/5 rounded-xl transition-colors group">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-accent" />
              <Label className="text-sm font-semibold text-foreground">Price Range</Label>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4">
            <div className="px-3">
              <Slider
                value={filters.priceRange}
                onValueChange={(value: [number, number]) => setPriceRange(value)}
                max={100}
                step={5}
                className="mb-4"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium bg-muted/50 px-3 py-1 rounded-lg">
                  ${filters.priceRange[0]}
                </span>
                <span className="text-xs text-muted-foreground">to</span>
                <span className="text-sm font-medium bg-muted/50 px-3 py-1 rounded-lg">
                  ${filters.priceRange[1]}+
                </span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator className="bg-white/10" />

        {/* Genres */}
        <Collapsible defaultOpen className="space-y-3">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-white/5 rounded-xl transition-colors group">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              <Label className="text-sm font-semibold text-foreground">Genres</Label>
              <Badge variant="outline" className="text-xs">
                {filters.selectedGenres.length}
              </Badge>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            <div className="max-h-48 overflow-y-auto custom-scrollbar px-3 space-y-2">
              {genres.map(genre => (
                <div key={genre} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <Checkbox
                    id={genre}
                    checked={filters.selectedGenres.includes(genre)}
                    onCheckedChange={() => toggleGenre(genre)}
                    className="border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor={genre} className="text-sm cursor-pointer text-foreground hover:text-primary transition-colors">
                    {genre}
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator className="bg-white/10" />

        {/* Special Filters */}
        <Collapsible defaultOpen className="space-y-3">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-white/5 rounded-xl transition-colors group">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <Label className="text-sm font-semibold text-foreground">Special Offers</Label>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 px-3">
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-500/5 border border-transparent hover:border-green-500/20 transition-all">
              <Checkbox
                id="free-games"
                checked={filters.showFreeOnly}
                onCheckedChange={toggleFreeOnly}
                className="border-green-500/50 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
              />
              <Label htmlFor="free-games" className="text-sm cursor-pointer text-foreground flex items-center gap-2">
                <span>💚</span>
                Free Games Only
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-500/5 border border-transparent hover:border-orange-500/20 transition-all">
              <Checkbox
                id="on-sale"
                checked={filters.showOnSaleOnly}
                onCheckedChange={toggleOnSaleOnly}
                className="border-orange-500/50 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
              />
              <Label htmlFor="on-sale" className="text-sm cursor-pointer text-foreground flex items-center gap-2">
                <span>🔥</span>
                On Sale Only
              </Label>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default FilterSidebar;
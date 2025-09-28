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
import { ChevronDown, X } from "lucide-react";

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
    <div className="filter-sidebar w-72 bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Sort By */}
      {hasActiveFilters && (
        <div className="mb-6">
          <Label className="text-sm font-medium mb-3 block">Sort By</Label>
          <Select value={filters.sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {filters.selectedGenres.map(genre => (
              <Badge 
                key={genre} 
                variant="secondary" 
                className="flex items-center gap-1"
              >
                {genre}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => toggleGenre(genre)}
                />
              </Badge>
            ))}
            {filters.showFreeOnly && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Free Games
                <X className="h-3 w-3 cursor-pointer" onClick={toggleFreeOnly} />
              </Badge>
            )}
            {filters.showOnSaleOnly && (
              <Badge variant="secondary" className="flex items-center gap-1">
                On Sale
                <X className="h-3 w-3 cursor-pointer" onClick={toggleOnSaleOnly} />
              </Badge>
            )}
          </div>
          <Separator className="mt-4" />
        </div>
      )}

      {/* Price Range */}
      <Collapsible defaultOpen className="mb-6">
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gaming-surface rounded-lg">
          <Label className="text-sm font-medium">Price Range</Label>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={(value: [number, number]) => setPriceRange(value)}
              max={100}
              step={5}
              className="mb-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}+</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator className="my-4" />

      {/* Genres */}
      <Collapsible defaultOpen className="mb-6">
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gaming-surface rounded-lg">
          <Label className="text-sm font-medium">Genres</Label>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <div className="space-y-3 px-2">
            {genres.map(genre => (
              <div key={genre} className="flex items-center space-x-2">
                <Checkbox
                  id={genre}
                  checked={filters.selectedGenres.includes(genre)}
                  onCheckedChange={() => toggleGenre(genre)}
                />
                <Label htmlFor={genre} className="text-sm cursor-pointer">
                  {genre}
                </Label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator className="my-4" />

      {/* Special Filters */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gaming-surface rounded-lg">
          <Label className="text-sm font-medium">Special Offers</Label>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <div className="space-y-3 px-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="free-games"
                checked={filters.showFreeOnly}
                onCheckedChange={toggleFreeOnly}
              />
              <Label htmlFor="free-games" className="text-sm cursor-pointer">
                Free Games Only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="on-sale"
                checked={filters.showOnSaleOnly}
                onCheckedChange={toggleOnSaleOnly}
              />
              <Label htmlFor="on-sale" className="text-sm cursor-pointer">
                On Sale Only
              </Label>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default FilterSidebar;
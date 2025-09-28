import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, X } from "lucide-react";

const FilterSidebar = () => {
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const genres = [
    "Action", "Adventure", "RPG", "Shooter", "Strategy", "Simulation", 
    "Sports", "Racing", "Horror", "Puzzle", "Platformer", "Indie", "Multiplayer"
  ];

  const platforms = ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile", "Cloud Gaming"];
  
  const features = ["Free to Play", "On Sale", "Early Access", "VR Support", "Controller Support"];

  const toggleFilter = (item: string, category: 'genres' | 'platforms' | 'features') => {
    const setters = {
      genres: setSelectedGenres,
      platforms: setSelectedPlatforms,
      features: setSelectedFeatures,
    };
    
    const getters = {
      genres: selectedGenres,
      platforms: selectedPlatforms,
      features: selectedFeatures,
    };

    const current = getters[category];
    const setter = setters[category];
    
    if (current.includes(item)) {
      setter(current.filter(i => i !== item));
    } else {
      setter([...current, item]);
    }
  };

  const clearAllFilters = () => {
    setPriceRange([0, 100]);
    setSelectedGenres([]);
    setSelectedPlatforms([]);
    setSelectedFeatures([]);
  };

  const hasActiveFilters = selectedGenres.length > 0 || selectedPlatforms.length > 0 || 
    selectedFeatures.length > 0 || priceRange[0] > 0 || priceRange[1] < 100;

  return (
    <div className="filter-sidebar w-72 bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {selectedGenres.map(genre => (
              <Badge 
                key={genre} 
                variant="secondary" 
                className="flex items-center gap-1"
              >
                {genre}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => toggleFilter(genre, 'genres')}
                />
              </Badge>
            ))}
            {selectedPlatforms.map(platform => (
              <Badge 
                key={platform} 
                variant="secondary" 
                className="flex items-center gap-1"
              >
                {platform}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => toggleFilter(platform, 'platforms')}
                />
              </Badge>
            ))}
            {selectedFeatures.map(feature => (
              <Badge 
                key={feature} 
                variant="secondary" 
                className="flex items-center gap-1"
              >
                {feature}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => toggleFilter(feature, 'features')}
                />
              </Badge>
            ))}
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
              value={priceRange}
              onValueChange={setPriceRange}
              max={100}
              step={5}
              className="mb-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}+</span>
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
                  checked={selectedGenres.includes(genre)}
                  onCheckedChange={() => toggleFilter(genre, 'genres')}
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

      {/* Platforms */}
      <Collapsible defaultOpen className="mb-6">
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gaming-surface rounded-lg">
          <Label className="text-sm font-medium">Platforms</Label>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <div className="space-y-3 px-2">
            {platforms.map(platform => (
              <div key={platform} className="flex items-center space-x-2">
                <Checkbox
                  id={platform}
                  checked={selectedPlatforms.includes(platform)}
                  onCheckedChange={() => toggleFilter(platform, 'platforms')}
                />
                <Label htmlFor={platform} className="text-sm cursor-pointer">
                  {platform}
                </Label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator className="my-4" />

      {/* Features */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gaming-surface rounded-lg">
          <Label className="text-sm font-medium">Features</Label>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <div className="space-y-3 px-2">
            {features.map(feature => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={feature}
                  checked={selectedFeatures.includes(feature)}
                  onCheckedChange={() => toggleFilter(feature, 'features')}
                />
                <Label htmlFor={feature} className="text-sm cursor-pointer">
                  {feature}
                </Label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default FilterSidebar;
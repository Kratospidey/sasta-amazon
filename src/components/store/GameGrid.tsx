import GameCard from "./GameCard";
import { useFilters } from "@/contexts/FilterContext";
import eldenRingCover from "@/assets/elden-ring-cover.png";
import genshinImpactCover from "@/assets/genshin-impact-cover.png";
import cosmicWarfareCover from "@/assets/cosmic-warfare-cover.png";
import amongUsCover from "@/assets/among-us-cover.png";
import valorantCover from "@/assets/valorant-cover.png";
import fortniteCover from "@/assets/fortnite-cover.png";
import cyberpunkCover from "@/assets/cyberpunk-cover.png";
import minecraftCover from "@/assets/minecraft-cover.png";
import apexLegendsCover from "@/assets/apex-legends-cover.png";
import witcherCover from "@/assets/witcher-cover.png";
import stardewValleyCover from "@/assets/stardew-valley-cover.png";
import fallGuysCover from "@/assets/fall-guys-cover.png";
import rocketLeagueCover from "@/assets/rocket-league-cover.png";
import leagueOfLegendsCover from "@/assets/league-of-legends-cover.png";

const GameGrid = () => {
  const { filters } = useFilters();
  
  const allGames = [
    {
      id: "1",
      title: "Elden Ring",
      developer: "FromSoftware", 
      image: eldenRingCover,
      price: 39.99,
      originalPrice: 59.99,
      rating: 4.9,
      reviewCount: 125487,
      tags: ["RPG", "Open World"],
      onSale: true,
      featured: true,
    },
    {
      id: "2", 
      title: "Genshin Impact",
      developer: "HoYoverse",
      image: genshinImpactCover,
      price: 0,
      rating: 4.6,
      reviewCount: 890000,
      tags: ["RPG", "Anime"],
      featured: true,
    },
    {
      id: "3",
      title: "Cosmic Warfare",
      developer: "Atavistia Studios",
      image: cosmicWarfareCover,
      price: 49.99,
      originalPrice: 59.99,
      rating: 4.6,
      reviewCount: 23450,
      tags: ["Sci-Fi", "Action"],
      onSale: true,
      featured: true,
    },
    {
      id: "7",
      title: "Fortnite",
      developer: "Epic Games",
      image: fortniteCover,
      price: 0,
      rating: 4.2,
      reviewCount: 450000,
      tags: ["Battle Royale", "Multiplayer"],
    },
    {
      id: "8",
      title: "Valorant",
      developer: "Riot Games", 
      image: valorantCover,
      price: 0,
      rating: 4.4,
      reviewCount: 280000,
      tags: ["Shooter", "Tactical"],
    },
    {
      id: "9",
      title: "Minecraft",
      developer: "Mojang Studios",
      image: minecraftCover,
      price: 26.95,
      rating: 4.9,
      reviewCount: 500000,
      tags: ["Sandbox", "Creative"],
      featured: true,
    },
    {
      id: "10",
      title: "Cyberpunk 2077",
      developer: "CD Projekt RED",
      image: cyberpunkCover,
      price: 29.99,
      originalPrice: 59.99,
      rating: 4.1,
      reviewCount: 167000,
      tags: ["RPG", "Cyberpunk"],
      onSale: true,
    },
    {
      id: "11",
      title: "Apex Legends",
      developer: "Respawn Entertainment",
      image: apexLegendsCover,
      price: 0,
      rating: 4.3,
      reviewCount: 325000,
      tags: ["Battle Royale", "Hero Shooter"],
    },
    {
      id: "13",
      title: "The Witcher 3: Wild Hunt",
      developer: "CD Projekt RED",
      image: witcherCover,
      price: 39.99,
      originalPrice: 59.99,
      rating: 4.9,
      reviewCount: 280000,
      tags: ["RPG", "Fantasy"],
      onSale: true,
      featured: true,
    },
    {
      id: "14",
      title: "Rocket League",
      developer: "Psyonix",
      image: rocketLeagueCover,
      price: 0,
      rating: 4.5,
      reviewCount: 178000,
      tags: ["Sports", "Racing"],
    },
    {
      id: "15",
      title: "Stardew Valley",
      developer: "ConcernedApe",
      image: stardewValleyCover,
      price: 14.99,
      rating: 4.9,
      reviewCount: 89000,
      tags: ["Simulation", "Indie"],
    },
    {
      id: "16",
      title: "League of Legends",
      developer: "Riot Games",
      image: leagueOfLegendsCover,
      price: 0,
      rating: 4.4,
      reviewCount: 892000,
      tags: ["MOBA", "Strategy"],
      featured: true,
    },
    {
      id: "17",
      title: "Fall Guys",
      developer: "Mediatonic",
      image: fallGuysCover,
      price: 0,
      rating: 4.2,
      reviewCount: 67000,
      tags: ["Party", "Multiplayer"],
    },
    {
      id: "18",
      title: "Among Us",
      developer: "InnerSloth",
      image: amongUsCover,
      price: 4.99,
      rating: 4.4,
      reviewCount: 234000,
      tags: ["Social", "Deduction"],
    },
  ];

  // Filter games based on current filters
  const filteredGames = allGames.filter(game => {
    // Search term filter
    if (filters.searchTerm && !game.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !game.developer.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !game.tags.some(tag => tag.toLowerCase().includes(filters.searchTerm.toLowerCase()))) {
      return false;
    }

    // Genre filter
    if (filters.selectedGenres.length > 0 && 
        !filters.selectedGenres.some(genre => game.tags.includes(genre))) {
      return false;
    }

    // Price range filter
    if (game.price < filters.priceRange[0] || game.price > filters.priceRange[1]) {
      return false;
    }

    // Free only filter
    if (filters.showFreeOnly && game.price > 0) {
      return false;
    }

    // On sale only filter
    if (filters.showOnSaleOnly && !game.onSale) {
      return false;
    }

    return true;
  });

  // Sort games based on selected sort option
  const sortedGames = [...filteredGames].sort((a, b) => {
    switch (filters.sortBy) {
      case 'name':
        return a.title.localeCompare(b.title);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popular':
      default:
        return b.reviewCount - a.reviewCount;
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {sortedGames.map((game) => (
        <GameCard key={game.id} {...game} />
      ))}
      {sortedGames.length === 0 && (
        <div className="col-span-full text-center py-12 text-muted-foreground">
          <p className="text-lg font-medium">No games found</p>
          <p className="text-sm">Try adjusting your filters or search term</p>
        </div>
      )}
    </div>
  );
};

export default GameGrid;
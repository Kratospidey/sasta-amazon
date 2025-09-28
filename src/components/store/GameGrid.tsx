import GameCard from "./GameCard";
import eldenRingCover from "@/assets/elden-ring-cover.png";
import genshinImpactCover from "@/assets/genshin-impact-cover.png";
import cosmicWarfareCover from "@/assets/cosmic-warfare-cover.png";
import game4 from "@/assets/game-4.jpg";
import game5 from "@/assets/game-5.jpg";
import game6 from "@/assets/game-6.jpg";
import amongUsCover from "@/assets/among-us-cover.png";
import valorantCover from "@/assets/valorant-cover.png";
import fortniteCover from "@/assets/fortnite-cover.png";
import cyberpunkCover from "@/assets/cyberpunk-cover.png";
import minecraftCover from "@/assets/minecraft-cover.png";
import apexLegendsCover from "@/assets/apex-legends-cover.png";

const GameGrid = () => {
  const games = [
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
      id: "4",
      title: "Enchanted Forest",
      developer: "Puzzle Magic",
      image: game4,
      price: 19.99,
      rating: 4.7,
      reviewCount: 6780,
      tags: ["Puzzle", "Adventure"],
    },
    {
      id: "5",
      title: "Shadow Manor",
      developer: "Horror House",
      image: game5,
      price: 34.99,
      originalPrice: 44.99,
      rating: 4.3,
      reviewCount: 9240,
      tags: ["Horror", "Survival"],
      onSale: true,
    },
    {
      id: "6",
      title: "Empire Builder",
      developer: "Strategy Masters",
      image: game6,
      price: 44.99,
      rating: 4.5,
      reviewCount: 11230,
      tags: ["Strategy", "Simulation"],
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
      id: "12", 
      title: "Call of Duty: Warzone",
      developer: "Activision",
      image: game6,
      price: 0,
      rating: 4.2,
      reviewCount: 240000,
      tags: ["Battle Royale", "Shooter"],
    },
    {
      id: "13",
      title: "The Witcher 3",
      developer: "CD Projekt RED",
      image: eldenRingCover,
      price: 49.99,
      originalPrice: 59.99,
      rating: 4.8,
      reviewCount: 245000,
      tags: ["RPG", "Souls-like"],
      onSale: true,
      featured: true,
    },
    {
      id: "14",
      title: "Rocket League",
      developer: "Psyonix",
      image: game6,
      price: 0,
      rating: 4.5,
      reviewCount: 178000,
      tags: ["Sports", "Racing"],
    },
    {
      id: "15",
      title: "Stardew Valley",
      developer: "ConcernedApe",
      image: game4,
      price: 14.99,
      rating: 4.9,
      reviewCount: 89000,
      tags: ["Simulation", "Indie"],
    },
    {
      id: "16",
      title: "Call of Duty: MW3",
      developer: "Activision",
      image: game5,
      price: 69.99,
      rating: 4.0,
      reviewCount: 156000,
      tags: ["Shooter", "Military"],
    },
    {
      id: "17",
      title: "Fall Guys",
      developer: "Mediatonic",
      image: game5,
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

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {games.map((game) => (
        <GameCard key={game.id} {...game} />
      ))}
    </div>
  );
};

export default GameGrid;
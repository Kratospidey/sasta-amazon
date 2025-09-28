import { useParams } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Play, 
  Monitor, 
  Smartphone, 
  Gamepad2,
  Star,
  ThumbsUp,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Header from "@/components/layout/Header";
import eldenRingCover from "@/assets/elden-ring-cover.png";
import eldenRingScreenshot1 from "@/assets/elden-ring-screenshot-1.png";
import eldenRingScreenshot2 from "@/assets/elden-ring-screenshot-2.png";
import eldenRingScreenshot3 from "@/assets/elden-ring-screenshot-3.png";
import genshinImpactCover from "@/assets/genshin-impact-cover.png";
import genshinImpactScreenshot1 from "@/assets/genshin-impact-screenshot-1.png";
import genshinImpactScreenshot2 from "@/assets/genshin-impact-screenshot-2.png";
import genshinImpactScreenshot3 from "@/assets/genshin-impact-screenshot-3.png";
import genshinImpactScreenshot4 from "@/assets/genshin-impact-screenshot-4.png";
import cosmicWarfareCover from "@/assets/cosmic-warfare-cover.png";
import cosmicWarfareScreenshot1 from "@/assets/cosmic-warfare-screenshot-1.png";
import cosmicWarfareScreenshot2 from "@/assets/cosmic-warfare-screenshot-2.png";
import amongUsCover from "@/assets/among-us-cover.png";
import amongUsScreenshot1 from "@/assets/among-us-screenshot-1.png";
import amongUsScreenshot2 from "@/assets/among-us-screenshot-2.png";
import amongUsScreenshot3 from "@/assets/among-us-screenshot-3.png";
import amongUsScreenshot4 from "@/assets/among-us-screenshot-4.png";
import valorantCover from "@/assets/valorant-cover.png";
import valorantScreenshot1 from "@/assets/valorant-screenshot-1.png";
import valorantScreenshot2 from "@/assets/valorant-screenshot-2.png";
import valorantScreenshot3 from "@/assets/valorant-screenshot-3.png";
import valorantScreenshot4 from "@/assets/valorant-screenshot-4.png";
import fortniteCover from "@/assets/fortnite-cover.png";
import fortniteScreenshot1 from "@/assets/fortnite-screenshot-1.png";
import fortniteScreenshot2 from "@/assets/fortnite-screenshot-2.png";
import fortniteScreenshot3 from "@/assets/fortnite-screenshot-3.png";
import fortniteScreenshot4 from "@/assets/fortnite-screenshot-4.png";
import cyberpunkCover from "@/assets/cyberpunk-cover.png";
import cyberpunkScreenshot1 from "@/assets/cyberpunk-screenshot-1.png";
import cyberpunkScreenshot2 from "@/assets/cyberpunk-screenshot-2.png";
import cyberpunkScreenshot3 from "@/assets/cyberpunk-screenshot-3.png";
import cyberpunkScreenshot4 from "@/assets/cyberpunk-screenshot-4.png";
import minecraftCover from "@/assets/minecraft-cover.png";
import minecraftScreenshot1 from "@/assets/minecraft-screenshot-1.png";
import minecraftScreenshot2 from "@/assets/minecraft-screenshot-2.png";
import minecraftScreenshot3 from "@/assets/minecraft-screenshot-3.png";
import minecraftScreenshot4 from "@/assets/minecraft-screenshot-4.png";
import apexLegendsCover from "@/assets/apex-legends-cover.png";
import apexLegendsScreenshot1 from "@/assets/apex-legends-screenshot-1.png";
import apexLegendsScreenshot2 from "@/assets/apex-legends-screenshot-2.png";
import apexLegendsScreenshot3 from "@/assets/apex-legends-screenshot-3.png";
import apexLegendsScreenshot4 from "@/assets/apex-legends-screenshot-4.png";

const GameDetails = () => {
  const { id } = useParams();
  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Game data based on ID
  const getGameData = (gameId: string) => {
    if (gameId === "2") {
      return {
        id: gameId,
        title: "Genshin Impact",
        developer: "HoYoverse",
        publisher: "HoYoverse",
        price: "Free",
        originalPrice: null,
        rating: 4.6,
        reviews: 890000,
        releaseDate: "September 28, 2020",
        platforms: ["PC", "Mobile", "PlayStation", "Xbox"],
        genres: ["Action", "RPG", "Open World", "Anime"],
        description: "Step into Teyvat, a vast world teeming with life and flowing with elemental energy. You and your sibling arrived here from another world. Separated by an unknown god, stripped of your powers, and cast into a deep slumber, you now awake to a world very different from when you first arrived.",
        features: [
          "Open-world action RPG driven by elemental combat",
          "Team up to 4 characters in your party",
          "Explore every inch of this wondrous world",
          "Join forces with diverse cast of characters",
          "Unravel mysteries of Teyvat"
        ],
        screenshots: [
          genshinImpactCover,
          genshinImpactScreenshot1,
          genshinImpactScreenshot2,
          genshinImpactScreenshot3,
          genshinImpactScreenshot4
        ],
        coverImage: genshinImpactCover,
        systemRequirements: {
          minimum: {
            os: "Windows 7 SP1 64-bit / Windows 8.1 64-bit / Windows 10 64-bit",
            processor: "Intel Core i5 or equivalent",
            memory: "8 GB RAM",
            graphics: "NVIDIA GeForce GT 1030",
            storage: "30 GB available space"
          },
          recommended: {
            os: "Windows 10 64-bit",
            processor: "Intel Core i7 or equivalent",
            memory: "16 GB RAM",
            graphics: "NVIDIA GeForce GTX 1060 6GB",
            storage: "30 GB available space"
          }
        }
      };
    }
    
    if (gameId === "3") {
      return {
        id: gameId,
        title: "Cosmic Warfare",
        developer: "Atavistia Studios",
        publisher: "Atavistia Studios",
        price: "$49.99",
        originalPrice: "$59.99",
        rating: 4.6,
        reviews: 23450,
        releaseDate: "November 15, 2024",
        platforms: ["PC", "PlayStation", "Xbox"],
        genres: ["Sci-Fi", "Action", "Space Combat"],
        description: "Command massive fleets in epic space battles across the galaxy. Engage in strategic warfare among the stars, utilizing advanced technology and tactics to dominate your enemies. Experience the ultimate cosmic conflict where every decision shapes the fate of civilizations.",
        features: [
          "Epic space fleet battles",
          "Advanced tactical combat system",
          "Massive galaxy to explore",
          "Customizable ships and weapons",
          "Multiplayer campaigns"
        ],
        screenshots: [
          cosmicWarfareCover,
          cosmicWarfareScreenshot1,
          cosmicWarfareScreenshot2,
          cosmicWarfareCover
        ],
        coverImage: cosmicWarfareCover,
        systemRequirements: {
          minimum: {
            os: "Windows 10 64-bit",
            processor: "Intel Core i5-8400 / AMD Ryzen 5 2600",
            memory: "8 GB RAM",
            graphics: "NVIDIA GeForce GTX 1060 / AMD Radeon RX 580",
            storage: "50 GB available space"
          },
          recommended: {
            os: "Windows 11 64-bit",
            processor: "Intel Core i7-10700K / AMD Ryzen 7 3700X",
            memory: "16 GB RAM",
            graphics: "NVIDIA GeForce RTX 3070 / AMD Radeon RX 6700 XT",
            storage: "50 GB available space (SSD recommended)"
          }
        }
      };
    }
    
    if (gameId === "18") {
      return {
        id: gameId,
        title: "Among Us",
        developer: "InnerSloth",
        publisher: "InnerSloth",
        price: "$4.99",
        originalPrice: null,
        rating: 4.4,
        reviews: 234000,
        releaseDate: "June 15, 2018",
        platforms: ["PC", "Mobile", "PlayStation", "Xbox", "Nintendo Switch"],
        genres: ["Social Deduction", "Party", "Multiplayer"],
        description: "Play with 4-15 player online or via local WiFi as you attempt to prepare your spaceship for departure, but beware as one or more random players among the Crew are Impostors bent on killing everyone! Originally created as a party game, we recommend playing with friends at a LAN party or online using voice chat.",
        features: [
          "Cross-platform multiplayer for up to 15 players",
          "Social deduction gameplay with friends",
          "Multiple maps and customization options",
          "Voice chat integration",
          "Regular content updates"
        ],
        screenshots: [
          amongUsCover,
          amongUsScreenshot1,
          amongUsScreenshot2,
          amongUsScreenshot3,
          amongUsScreenshot4
        ],
        coverImage: amongUsCover,
        systemRequirements: {
          minimum: {
            os: "Windows 7 SP1+",
            processor: "SSE2 instruction set support",
            memory: "1 GB RAM",
            graphics: "Graphics card with DX10 (shader model 4.0) capabilities",
            storage: "250 MB available space"
          },
          recommended: {
            os: "Windows 10",
            processor: "Intel Core i3 or equivalent",
            memory: "2 GB RAM",
            graphics: "Graphics card with DX11 support",
            storage: "500 MB available space"
          }
        }
      };
    }
    
    if (gameId === "8") {
      return {
        id: gameId,
        title: "Valorant",
        developer: "Riot Games",
        publisher: "Riot Games",
        price: "Free",
        originalPrice: null,
        rating: 4.4,
        reviews: 280000,
        releaseDate: "June 2, 2020",
        platforms: ["PC"],
        genres: ["Tactical Shooter", "FPS", "Competitive"],
        description: "Blend your style and experience on a global, competitive stage. You have 13 rounds to attack and defend your side using sharp gunplay and tactical abilities. And, with one life per-round, you'll need to think faster than your opponent if you want to survive.",
        features: [
          "Precise gunplay with first-shot accuracy",
          "Unique agent abilities and ultimates",
          "Competitive ranked system",
          "13-round tactical matches",
          "Regular content updates and new agents"
        ],
        screenshots: [
          valorantCover,
          valorantScreenshot1,
          valorantScreenshot2,
          valorantScreenshot3,
          valorantScreenshot4
        ],
        coverImage: valorantCover,
        systemRequirements: {
          minimum: {
            os: "Windows 7/8/10 64-bit",
            processor: "Intel i3-370M",
            memory: "4 GB RAM",
            graphics: "Intel HD 3000",
            storage: "8 GB available space"
          },
          recommended: {
            os: "Windows 10 64-bit",
            processor: "Intel i5-4460 3.2GHz",
            memory: "8 GB RAM",
            graphics: "GTX 1050 Ti",
            storage: "8 GB available space"
          }
        }
      };
    }
    
    if (gameId === "7") {
      return {
        id: gameId,
        title: "Fortnite",
        developer: "Epic Games",
        publisher: "Epic Games",
        price: "Free",
        originalPrice: null,
        rating: 4.2,
        reviews: 450000,
        releaseDate: "July 21, 2017",
        platforms: ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"],
        genres: ["Battle Royale", "Building", "Shooter"],
        description: "Fortnite is the completely free multiplayer game where you and your friends can jump into Battle Royale or Fortnite Creative. Download now and jump into the action. In Battle Royale, you'll compete with up to 100 other players to be the last one standing in an ever-shrinking map.",
        features: [
          "100-player Battle Royale matches",
          "Unique building mechanics",
          "Regular content updates and events",
          "Cross-platform play",
          "Creative mode for building and custom games"
        ],
        screenshots: [
          fortniteCover,
          fortniteScreenshot1,
          fortniteScreenshot2,
          fortniteScreenshot3,
          fortniteScreenshot4
        ],
        coverImage: fortniteCover,
        systemRequirements: {
          minimum: {
            os: "Windows 7/8/10 64-bit or Mac OS Mojave 10.14.6",
            processor: "Core i3-3225 3.3 GHz",
            memory: "4 GB RAM",
            graphics: "Intel HD 4000 on PC; Intel Iris Pro 5200",
            storage: "15 GB available space"
          },
          recommended: {
            os: "Windows 10 64-bit",
            processor: "Core i5-7300U 3.5 GHz",
            memory: "8 GB RAM",
            graphics: "Nvidia GTX 960, AMD R9 280, or equivalent DX11 GPU",
            storage: "15 GB available space"
          }
        }
      };
    }
    
    if (gameId === "10") {
      return {
        id: gameId,
        title: "Cyberpunk 2077",
        developer: "CD Projekt RED",
        publisher: "CD Projekt RED",
        price: "$29.99",
        originalPrice: "$59.99",
        rating: 4.1,
        reviews: 167000,
        releaseDate: "December 10, 2020",
        platforms: ["PC", "PlayStation", "Xbox"],
        genres: ["RPG", "Open World", "Cyberpunk"],
        description: "Cyberpunk 2077 is an open-world, action-adventure RPG set in the dark future of Night City — a dangerous megalopolis obsessed with power, glamor, and ceaseless body modification. You play as V, a mercenary outlaw going after a one-of-a-kind implant that is the key to immortality.",
        features: [
          "Open-world Night City with six distinct districts",
          "Deep character customization and progression",
          "Multiple story paths and endings",
          "Advanced cybernetic enhancements",
          "Immersive first-person experience"
        ],
        screenshots: [
          cyberpunkCover,
          cyberpunkScreenshot1,
          cyberpunkScreenshot2,
          cyberpunkScreenshot3,
          cyberpunkScreenshot4
        ],
        coverImage: cyberpunkCover,
        systemRequirements: {
          minimum: {
            os: "Windows 10 64-bit",
            processor: "Intel Core i5-3570K / AMD FX-8310",
            memory: "8 GB RAM",
            graphics: "NVIDIA GeForce GTX 780 / AMD Radeon RX 470",
            storage: "70 GB available space"
          },
          recommended: {
            os: "Windows 10 64-bit",
            processor: "Intel Core i7-4790 / AMD Ryzen 3 3200G",
            memory: "12 GB RAM",
            graphics: "NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 590",
            storage: "70 GB available space (SSD recommended)"
          }
        }
      };
    }
    
    if (gameId === "9") {
      return {
        id: gameId,
        title: "Minecraft",
        developer: "Mojang Studios",
        publisher: "Microsoft Studios",
        price: "$26.95",
        originalPrice: null,
        rating: 4.9,
        reviews: 500000,
        releaseDate: "November 18, 2011",
        platforms: ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"],
        genres: ["Sandbox", "Survival", "Creative"],
        description: "Minecraft is a game about placing blocks and going on adventures. Explore randomly generated worlds and build amazing things from the simplest of homes to the grandest of castles. Play in creative mode with unlimited resources or mine deep into the world in survival mode.",
        features: [
          "Infinite worlds with endless possibilities",
          "Creative and survival game modes",
          "Multiplayer support for shared adventures",
          "Regular updates with new content",
          "Cross-platform play across devices"
        ],
        screenshots: [
          minecraftCover,
          minecraftScreenshot1,
          minecraftScreenshot2,
          minecraftScreenshot3,
          minecraftScreenshot4
        ],
        coverImage: minecraftCover,
        systemRequirements: {
          minimum: {
            os: "Windows 7 and up",
            processor: "Intel Core i3-3210 3.2 GHz / AMD A8-7600 APU 3.1 GHz",
            memory: "4 GB RAM",
            graphics: "Intel HD Graphics 4000 / AMD Radeon R5 series",
            storage: "1 GB available space"
          },
          recommended: {
            os: "Windows 10",
            processor: "Intel Core i5-4690 3.5GHz / AMD A10-7800 APU 3.5 GHz",
            memory: "8 GB RAM",
            graphics: "GeForce 700 Series / AMD Radeon Rx 200 Series",
            storage: "4 GB available space (SSD recommended)"
          }
        }
      };
    }
    
    if (gameId === "11") {
      return {
        id: gameId,
        title: "Apex Legends",
        developer: "Respawn Entertainment",
        publisher: "Electronic Arts",
        price: "Free",
        originalPrice: null,
        rating: 4.3,
        reviews: 325000,
        releaseDate: "February 4, 2019",
        platforms: ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"],
        genres: ["Battle Royale", "Hero Shooter", "First-Person Shooter"],
        description: "Conquer with character in Apex Legends, a free-to-play Battle Royale shooter where legendary characters with powerful abilities team up to battle for fame & fortune on the fringes of the Frontier. Master an ever-growing roster of diverse Legends, deep tactical squad play and bold new innovations.",
        features: [
          "Choose from a diverse cast of unique Legends",
          "Master their powerful abilities on the battlefield",
          "Squad-based tactical gameplay",
          "Evolving world with new content every season",
          "Cross-platform play and progression"
        ],
        screenshots: [
          apexLegendsCover,
          apexLegendsScreenshot1,
          apexLegendsScreenshot2,
          apexLegendsScreenshot3,
          apexLegendsScreenshot4
        ],
        coverImage: apexLegendsCover,
        systemRequirements: {
          minimum: {
            os: "Windows 7 64-bit",
            processor: "Intel Core i3-6300 3.8GHz / AMD FX-4350 4.2GHz",
            memory: "6 GB RAM",
            graphics: "NVIDIA GeForce GT 640 / AMD Radeon HD 7730",
            storage: "22 GB available space"
          },
          recommended: {
            os: "Windows 10 64-bit",
            processor: "Intel i5 3570K or equivalent",
            memory: "8 GB RAM",
            graphics: "NVIDIA GeForce GTX 970 / AMD Radeon R9 290",
            storage: "22 GB available space"
          }
        }
      };
    }
    
    // Default to Elden Ring (game ID 1 or any other)
    return {
      id: gameId,
      title: "Elden Ring",
      developer: "FromSoftware",
      publisher: "Bandai Namco",
      price: "$39.99",
      originalPrice: "$59.99",
      rating: 4.9,
      reviews: 125487,
      releaseDate: "February 25, 2022",
      platforms: ["PC", "PlayStation", "Xbox"],
      genres: ["Action", "RPG", "Open World"],
      description: "THE NEW FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between. In the Lands Between ruled by Queen Marika the Eternal, the Elden Ring, the source of the Erdtree, has been shattered.",
      features: [
        "Massive open-world exploration",
        "Deep character customization",
        "Challenging boss battles",
        "Multiplayer cooperative play",
        "Rich storytelling and lore"
      ],
      screenshots: [
        eldenRingScreenshot1,
        eldenRingScreenshot2,
        eldenRingScreenshot3,
        eldenRingCover
      ],
      coverImage: eldenRingCover,
      systemRequirements: {
        minimum: {
          os: "Windows 10",
          processor: "Intel Core i5-8400 / AMD Ryzen 3 3300X",
          memory: "12 GB RAM",
          graphics: "NVIDIA GeForce GTX 1060 3GB / AMD Radeon RX 580 4GB",
          storage: "60 GB available space"
        },
        recommended: {
          os: "Windows 10/11",
          processor: "Intel Core i7-8700K / AMD Ryzen 5 3600X",
          memory: "16 GB RAM",
          graphics: "NVIDIA GeForce GTX 1070 / AMD Radeon RX Vega 56",
          storage: "60 GB available space"
        }
      }
    };
  };

  const game = getGameData(id || "1");
  const reviews = [
    {
      id: 1,
      user: "GamerPro2023",
      rating: 5,
      comment: "Absolutely incredible game! The world design is breathtaking and the gameplay is challenging but fair.",
      date: "2 days ago",
      helpful: 156
    },
    {
      id: 2,
      user: "RPGLover",
      rating: 4,
      comment: "Great game with amazing visuals. The difficulty can be frustrating at times but very rewarding.",
      date: "1 week ago", 
      helpful: 89
    }
  ];

  const nextScreenshot = () => {
    setCurrentScreenshot((prev) => (prev + 1) % game.screenshots.length);
  };

  const prevScreenshot = () => {
    setCurrentScreenshot((prev) => (prev - 1 + game.screenshots.length) % game.screenshots.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Game Header */}
      <div className="relative h-[400px] bg-gaming-surface">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <img 
              src={game.coverImage} 
              alt={game.title}
              className="w-48 h-64 object-cover rounded-xl shadow-lg"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {game.genres.map((genre) => (
                  <Badge key={genre} variant="secondary">{genre}</Badge>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{game.title}</h1>
              <p className="text-lg text-white/80 mb-4">{game.developer} • {game.releaseDate}</p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < Math.floor(game.rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
                    />
                  ))}
                  <span className="text-white ml-2">{game.rating} ({game.reviews.toLocaleString()} reviews)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-2">
                  {game.platforms.map((platform) => (
                    <div key={platform} className="flex items-center gap-1 text-white/80">
                      {platform === 'PC' && <Monitor className="h-4 w-4" />}
                      {platform === 'PlayStation' && <Gamepad2 className="h-4 w-4" />}
                      {platform === 'Xbox' && <Gamepad2 className="h-4 w-4" />}
                      {platform === 'Mobile' && <Smartphone className="h-4 w-4" />}
                      <span className="text-sm">{platform}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-white">{game.price}</span>
                {game.originalPrice && (
                  <span className="text-lg text-white/60 line-through">{game.originalPrice}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Buy Section */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">{game.title}</h2>
              <span className="text-2xl font-bold text-primary">{game.price}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={isWishlisted ? "text-red-500 border-red-500" : ""}
              >
                <Heart className={`h-4 w-4 mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
                {isWishlisted ? "Wishlisted" : "Wishlist"}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary-hover">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Screenshot Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={game.screenshots[currentScreenshot]} 
                    alt={`Screenshot ${currentScreenshot + 1}`}
                    className="w-full h-64 md:h-96 object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                    onClick={prevScreenshot}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                    onClick={nextScreenshot}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {game.screenshots.map((screenshot, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentScreenshot(index)}
                      className={`flex-shrink-0 w-20 h-12 rounded border-2 overflow-hidden ${
                        index === currentScreenshot ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img src={screenshot} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">About This Game</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">{game.description}</p>
                
                <h4 className="font-semibold mb-3">Key Features</h4>
                <ul className="space-y-2">
                  {game.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* System Requirements */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">System Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Minimum</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">OS:</span> {game.systemRequirements.minimum.os}</div>
                      <div><span className="font-medium">Processor:</span> {game.systemRequirements.minimum.processor}</div>
                      <div><span className="font-medium">Memory:</span> {game.systemRequirements.minimum.memory}</div>
                      <div><span className="font-medium">Graphics:</span> {game.systemRequirements.minimum.graphics}</div>
                      <div><span className="font-medium">Storage:</span> {game.systemRequirements.minimum.storage}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Recommended</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">OS:</span> {game.systemRequirements.recommended.os}</div>
                      <div><span className="font-medium">Processor:</span> {game.systemRequirements.recommended.processor}</div>
                      <div><span className="font-medium">Memory:</span> {game.systemRequirements.recommended.memory}</div>
                      <div><span className="font-medium">Graphics:</span> {game.systemRequirements.recommended.graphics}</div>
                      <div><span className="font-medium">Storage:</span> {game.systemRequirements.recommended.storage}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-border pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.user}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-muted-foreground mb-2">{review.comment}</p>
                      <Button variant="ghost" size="sm" className="text-muted-foreground p-0 h-auto">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Helpful ({review.helpful})
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card className="sticky top-32">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold">{game.price}</span>
                  {game.originalPrice && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">{game.originalPrice}</span>
                      <Badge variant="destructive">33% OFF</Badge>
                    </>
                  )}
                </div>
                
                <div className="space-y-3">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary-hover">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Heart className="h-4 w-4 mr-2" />
                    Add to Wishlist
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Watch Trailer
                  </Button>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Developer:</span>
                    <span>{game.developer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Publisher:</span>
                    <span>{game.publisher}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Release Date:</span>
                    <span>{game.releaseDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Games */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">You Might Also Like</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                      <img 
                        src={`/game-${i + 1}.jpg`} 
                        alt={`Related game ${i}`}
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">Related Game {i}</h4>
                        <p className="text-sm text-muted-foreground">Action, RPG</p>
                        <p className="text-sm font-medium">$29.99</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
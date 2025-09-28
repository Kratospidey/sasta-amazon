import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { Star, ShoppingCart, Heart, Play } from "lucide-react";

interface GameCardProps {
  id: string;
  title: string;
  developer: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  onSale?: boolean;
  featured?: boolean;
}

const GameCard = ({
  id,
  title,
  developer,
  image,
  price,
  originalPrice,
  rating,
  reviewCount,
  tags,
  onSale = false,
  featured = false
}: GameCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const discountPercentage = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id,
      title,
      developer,
      image,
      price,
      originalPrice
    });
  };

  return (
    <div 
      className={`game-card-3d group cursor-pointer transition-all duration-500 perspective-1000 ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/game/${id}`)}
    >
      <div className="game-card-inner relative w-full h-full transform-style-preserve-3d transition-transform duration-500 group-hover:rotateY-5 group-hover:rotateX-2">
        <Card className="relative w-full h-full bg-gradient-to-br from-card via-card to-card/80 border-border/50 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-0 h-full">
            {/* Game Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-gradient-to-br from-primary/10 to-accent/10">
              <img 
                src={image} 
                alt={title}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
              />
              
              {/* Animated overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Floating action overlay */}
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}>
                <div className="bg-black/70 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <Button size="sm" className="bg-primary/90 hover:bg-primary border-0 shadow-lg">
                    <Play className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>

              {/* Top badges with glow */}
              <div className="absolute top-3 left-3 flex gap-2 z-10">
                {featured && (
                  <div className="relative">
                    <Badge className="bg-primary text-primary-foreground font-bold px-3 py-1 shadow-lg backdrop-blur-sm border border-primary/30">
                      ✨ Featured
                    </Badge>
                    <div className="absolute inset-0 bg-primary blur-md opacity-30 rounded-full" />
                  </div>
                )}
                {onSale && (
                  <div className="relative">
                    <Badge className="bg-gradient-to-r from-destructive to-accent text-white font-bold px-3 py-1 shadow-lg border border-white/20">
                      🔥 -{discountPercentage}%
                    </Badge>
                    <div className="absolute inset-0 bg-destructive blur-md opacity-40 rounded-full" />
                  </div>
                )}
              </div>

              {/* Wishlist button with glow */}
              <div className="absolute top-3 right-3 z-10">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0 bg-black/30 hover:bg-black/50 border border-white/20 backdrop-blur-md rounded-xl transition-all duration-300 hover:scale-110"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsWishlisted(!isWishlisted);
                  }}
                >
                  <Heart 
                    className={`h-5 w-5 transition-all duration-300 ${
                      isWishlisted 
                        ? 'fill-red-500 text-red-500 scale-110' 
                        : 'text-white hover:text-red-400'
                    }`} 
                  />
                </Button>
              </div>

              {/* Corner accent */}
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-primary/20 to-transparent" />
            </div>

            {/* Game Info Section */}
            <div className="p-5 bg-gradient-to-b from-card to-card/95 relative">
              {/* Subtle glow line */}
              <div className="absolute top-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              
              <div className="space-y-4">
                {/* Title and Developer */}
                <div>
                  <h3 className="font-bold text-xl text-foreground line-clamp-1 mb-1 group-hover:text-primary transition-colors duration-300">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">{developer}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 3).map((tag, index) => (
                    <span 
                      key={tag} 
                      className={`text-xs font-medium px-2 py-1 rounded-md transition-all duration-300 ${
                        index === 0 
                          ? 'bg-primary/20 text-primary border border-primary/30' 
                          : 'bg-muted/80 text-muted-foreground border border-border/50'
                      } hover:scale-105`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-4 w-4 transition-all duration-200 ${
                          i < Math.floor(rating) 
                            ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm' 
                            : 'text-muted-foreground/50'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-base font-bold text-foreground">{rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({reviewCount.toLocaleString()})
                  </span>
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-1">
                    {originalPrice && originalPrice > price ? (
                      <div className="flex items-center gap-3">
                        <span className="text-base line-through text-muted-foreground">
                          ${originalPrice}
                        </span>
                        <span className="text-2xl font-bold text-primary">
                          ${price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-foreground">
                        {price === 0 ? 'Free' : `$${price}`}
                      </span>
                    )}
                  </div>
                  
                  <Button 
                    className="px-6 py-2 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-primary/30"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GameCard;
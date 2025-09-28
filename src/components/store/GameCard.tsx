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
      className={`modern-game-card group cursor-pointer transition-all duration-700 ${isHovered ? 'card-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/game/${id}`)}
    >
      <div className="relative w-full bg-gradient-to-br from-card/90 via-card/95 to-card backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-primary/20 transition-all duration-700">
        
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 p-6 h-full flex flex-col">
          
          {/* Header with Image and Badges */}
          <div className="relative mb-4">
            <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-white/20 shadow-lg">
              <img 
                src={image} 
                alt={title}
                className="w-full h-full object-cover transition-all duration-700 group-hover:brightness-110"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Play Button Overlay */}
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="bg-black/70 backdrop-blur-sm rounded-full p-4 border border-white/30 hover:scale-110 transition-transform duration-300">
                  <Play className="h-6 w-6 text-white fill-white" />
                </div>
              </div>

              {/* Top Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                {featured && (
                  <Badge className="bg-gradient-to-r from-primary to-accent text-white font-bold px-3 py-1 rounded-full shadow-lg border border-white/20 backdrop-blur-sm">
                    Featured
                  </Badge>
                )}
                {onSale && (
                  <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold px-3 py-1 rounded-full shadow-lg border border-white/20 backdrop-blur-sm">
                    -{discountPercentage}%
                  </Badge>
                )}
              </div>

              {/* Wishlist Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-3 right-3 h-10 w-10 p-0 bg-black/30 hover:bg-primary/80 border border-white/30 backdrop-blur-sm rounded-full transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsWishlisted(!isWishlisted);
                }}
              >
                <Heart 
                  className={`h-5 w-5 transition-all duration-300 ${
                    isWishlisted 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-white hover:text-red-400'
                  }`} 
                />
              </Button>
            </div>
          </div>

          {/* Game Information */}
          <div className="flex-1 space-y-4">
            
            {/* Title and Developer */}
            <div>
              <h3 className="font-bold text-xl text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors duration-300">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground/80 font-medium">{developer}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={tag} 
                  className="px-3 py-1 text-xs font-medium bg-white/10 backdrop-blur-sm text-foreground/80 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={`h-4 w-4 transition-colors duration-200 ${
                      i < Math.floor(rating) 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-muted-foreground/40'
                    }`} 
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-foreground">{rating}</span>
                <span className="text-sm text-muted-foreground/70">
                  ({reviewCount.toLocaleString()})
                </span>
              </div>
            </div>
          </div>

          {/* Footer with Price and Action */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div>
              {originalPrice && originalPrice > price ? (
                <div className="space-y-1">
                  <span className="text-sm line-through text-muted-foreground/60">
                    ${originalPrice}
                  </span>
                  <div className="text-2xl font-bold text-primary">
                    ${price}
                  </div>
                </div>
              ) : (
                <div className="text-2xl font-bold text-foreground">
                  {price === 0 ? 'Free' : `$${price}`}
                </div>
              )}
            </div>
            
            <Button 
              className="px-6 py-3 font-bold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl border border-white/20 backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-105"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Animated Border Glow */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl border-2 border-primary/50 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default GameCard;
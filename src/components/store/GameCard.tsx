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
      className={`compact-game-card group cursor-pointer transition-all duration-300 ${isHovered ? 'card-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/game/${id}`)}
    >
      <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
        
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        </div>

        {/* Top Section - Badges and Wishlist */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
          <div className="flex gap-1">
            {featured && (
              <Badge className="bg-primary text-white font-medium px-2 py-1 text-xs rounded-md">
                Featured
              </Badge>
            )}
            {onSale && (
              <Badge className="bg-red-500 text-white font-medium px-2 py-1 text-xs rounded-md">
                -{discountPercentage}%
              </Badge>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 bg-black/40 hover:bg-black/60 rounded-full transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
          >
            <Heart 
              className={`h-3 w-3 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-white'}`} 
            />
          </Button>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
          
          {/* Title and Developer */}
          <div className="mb-2">
            <h3 className="font-bold text-lg text-white mb-0.5 line-clamp-1 drop-shadow-md">
              {title}
            </h3>
            <p className="text-xs text-gray-300 drop-shadow-sm">{developer}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.slice(0, 2).map((tag) => (
              <span 
                key={tag} 
                className="px-2 py-0.5 text-xs bg-white/20 backdrop-blur-sm text-white rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(rating) 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-white/30'
                  }`} 
                />
              ))}
            </div>
            <span className="text-sm font-bold text-white">{rating}</span>
            <span className="text-xs text-gray-300">
              ({reviewCount.toLocaleString()})
            </span>
          </div>

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between">
            <div>
              {originalPrice && originalPrice > price ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm line-through text-gray-400">
                    ${originalPrice}
                  </span>
                  <span className="text-xl font-bold text-white">
                    ${price}
                  </span>
                </div>
              ) : (
                <span className="text-xl font-bold text-white">
                  {price === 0 ? 'Free' : `$${price}`}
                </span>
              )}
            </div>
            
            <Button 
              size="sm"
              className="px-3 py-1.5 text-xs font-medium bg-primary hover:bg-primary/90 text-white rounded-lg transition-all duration-200"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
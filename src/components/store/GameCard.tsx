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
      className={`stylish-game-card group cursor-pointer transition-all duration-500 ${isHovered ? 'card-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/game/${id}`)}
    >
      <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-500">
        
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
        </div>

        {/* Top Section - Badges and Wishlist */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
          <div className="flex gap-2">
            {featured && (
              <Badge className="bg-primary text-white font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
                Featured
              </Badge>
            )}
            {onSale && (
              <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
                -{discountPercentage}% OFF
              </Badge>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 bg-black/50 hover:bg-black/70 border border-white/30 backdrop-blur-sm rounded-full transition-all duration-300"
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

        {/* Center Play Button (appears on hover) */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="bg-black/70 backdrop-blur-sm rounded-full p-4 border border-white/30 hover:scale-110 transition-transform duration-300">
            <Play className="h-8 w-8 text-white fill-white" />
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          
          {/* Title and Developer */}
          <div className="mb-3">
            <h3 className="font-bold text-2xl text-white mb-1 line-clamp-1 drop-shadow-lg">
              {title}
            </h3>
            <p className="text-sm text-gray-300 font-medium drop-shadow-md">{developer}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag, index) => (
              <span 
                key={tag} 
                className="px-3 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className={`h-4 w-4 drop-shadow-sm ${
                    i < Math.floor(rating) 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-white/40'
                  }`} 
                />
              ))}
            </div>
            <span className="text-lg font-bold text-white drop-shadow-md">{rating}</span>
            <span className="text-sm text-gray-300 drop-shadow-sm">
              ({reviewCount.toLocaleString()})
            </span>
          </div>

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between">
            <div>
              {originalPrice && originalPrice > price ? (
                <div className="flex items-center gap-3">
                  <span className="text-lg line-through text-gray-400 drop-shadow-sm">
                    ${originalPrice}
                  </span>
                  <span className="text-3xl font-bold text-white drop-shadow-lg">
                    ${price}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-white drop-shadow-lg">
                  {price === 0 ? 'Free' : `$${price}`}
                </span>
              )}
            </div>
            
            <Button 
              className="px-6 py-3 font-bold bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl border border-white/20 backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-105"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Subtle border glow on hover */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/50 transition-all duration-500" />
      </div>
    </div>
  );
};

export default GameCard;
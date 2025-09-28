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
    <Card 
      className={`clean-game-card group cursor-pointer transition-all duration-300 max-w-sm ${isHovered ? 'card-hover' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/game/${id}`)}
    >
      <CardContent className="p-0">
        {/* Game Image */}
        <div className="relative aspect-[3/2] overflow-hidden rounded-t-xl">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Hover Overlay */}
          <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          } flex items-center justify-center`}>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white font-medium">
              <Play className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2 z-10">
            {featured && (
              <Badge className="bg-primary text-white font-medium px-2 py-1 text-xs">
                Featured
              </Badge>
            )}
            {onSale && (
              <Badge className="bg-destructive text-white font-medium px-2 py-1 text-xs">
                -{discountPercentage}% OFF
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-3 right-3 h-8 w-8 p-0 bg-white/90 hover:bg-white text-black rounded-full shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
          >
            <Heart 
              className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </Button>
        </div>

        {/* Game Info */}
        <div className="p-4 bg-card">
          {/* Title and Developer */}
          <div className="mb-3">
            <h3 className="font-bold text-lg text-foreground line-clamp-1 mb-1">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">{developer}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map(tag => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs h-6 px-2 text-muted-foreground border-border"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(rating) 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-muted-foreground/30'
                  }`} 
                />
              ))}
            </div>
            <span className="text-sm font-medium text-foreground">{rating}</span>
            <span className="text-xs text-muted-foreground">
              ({reviewCount.toLocaleString()})
            </span>
          </div>

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {originalPrice && originalPrice > price ? (
                <>
                  <span className="text-xs line-through text-muted-foreground">
                    ${originalPrice}
                  </span>
                  <span className="text-xl font-bold text-primary">
                    ${price}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-foreground">
                  {price === 0 ? 'Free' : `$${price}`}
                </span>
              )}
            </div>
            
            <Button 
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white font-medium px-4"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameCard;
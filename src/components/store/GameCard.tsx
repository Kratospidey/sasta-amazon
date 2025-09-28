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
      className={`game-card group cursor-pointer transition-all duration-300 ${isHovered ? 'game-card-hover' : ''} max-w-sm`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/game/${id}`)}
    >
      <CardContent className="p-0">
        {/* Game Image */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-t-xl">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Overlay on hover */}
          <div className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          } flex items-center justify-center`}>
            <Button size="sm" className="bg-primary/90 hover:bg-primary">
              <Play className="h-4 w-4 mr-2" />
              View Trailer
            </Button>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {featured && (
              <Badge className="bg-primary text-primary-foreground font-medium px-2 py-1">
                Featured
              </Badge>
            )}
            {onSale && (
              <Badge className="bg-destructive text-destructive-foreground font-medium px-2 py-1">
                Sale
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="sm"
            className={`absolute top-3 right-3 h-9 w-9 p-0 bg-black/50 hover:bg-black/70 border border-white/20 transition-all duration-300`}
            onClick={(e) => {
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
          >
            <Heart 
              className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-white'}`} 
            />
          </Button>
        </div>

        {/* Game Info */}
        <div className="p-4 bg-card">
          <div className="mb-3">
            <h3 className="font-bold text-lg text-foreground line-clamp-1 mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{developer}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map(tag => (
              <span 
                key={tag} 
                className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
              />
            ))}
            <span className="text-sm font-bold text-foreground ml-2">{rating}</span>
            <span className="text-sm text-muted-foreground">
              ({reviewCount.toLocaleString()})
            </span>
          </div>

          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {originalPrice && originalPrice > price ? (
                <>
                  <span className="text-sm line-through text-muted-foreground">
                    ${originalPrice}
                  </span>
                  <span className="text-xl font-bold text-foreground">
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
              className="px-4 py-2 font-medium"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameCard;
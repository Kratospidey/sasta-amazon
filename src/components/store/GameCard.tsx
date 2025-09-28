import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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

  const discountPercentage = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <Card 
      className={`game-card group cursor-pointer transition-all duration-300 ${isHovered ? 'game-card-hover' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/game/${id}`)}
    >
      <CardContent className="p-0">
        {/* Game Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
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
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {featured && (
              <Badge className="bg-accent text-accent-foreground">Featured</Badge>
            )}
            {onSale && (
              <Badge variant="destructive">-{discountPercentage}%</Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="sm"
            className={`absolute top-2 right-2 h-8 w-8 p-0 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-70'
            }`}
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
        <div className="p-4">
          <div className="mb-2">
            <h3 className="font-semibold text-sm line-clamp-1 mb-1">{title}</h3>
            <p className="text-xs text-muted-foreground">{developer}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 2).map(tag => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs py-0 px-2 h-5"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{rating}</span>
            <span className="text-xs text-muted-foreground">
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
                  <span className="text-sm font-semibold text-primary">
                    ${price}
                  </span>
                </>
              ) : (
                <span className="text-sm font-semibold">
                  {price === 0 ? 'Free' : `$${price}`}
                </span>
              )}
            </div>
            
            <Button 
              size="sm" 
              className="h-7 px-2"
              onClick={(e) => e.stopPropagation()}
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameCard;
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Play, ShoppingCart } from "lucide-react";
import heroImage from "@/assets/hero-banner.jpg";
import eldenRingHero from "@/assets/elden-ring-hero.png";

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Elden Ring",
      subtitle: "Embark on a journey through the Lands Between",
      image: eldenRingHero,
      price: "$39.99",
      originalPrice: "$59.99",
      badge: "Featured",
    },
    {
      title: "Genshin Impact",
      subtitle: "Explore the vast world of Teyvat in this action RPG",
      image: heroImage,
      price: "Free",
      originalPrice: null,
      badge: "Free to Play",
    },
    {
      title: "Valorant",
      subtitle: "Tactical 5v5 character-based shooter",
      image: heroImage,
      price: "Free",
      originalPrice: null,
      badge: "Free to Play",
    },
    {
      title: "Fortnite",
      subtitle: "Battle Royale with building mechanics",
      image: heroImage,
      price: "Free",
      originalPrice: null,
      badge: "Most Popular",
    },
    {
      title: "Minecraft",
      subtitle: "Build, explore, and survive in infinite worlds",
      image: heroImage,
      price: "$26.95",
      originalPrice: null,
      badge: "Bestseller",
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-2xl">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${currentSlideData.image})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl animate-fade-in">
            {/* Badge */}
            <Badge 
              className={`mb-4 ${
                currentSlideData.badge === 'Featured' 
                  ? 'bg-accent text-accent-foreground' 
                  : currentSlideData.badge === 'New Release'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-gaming-success text-white'
              }`}
            >
              {currentSlideData.badge}
            </Badge>

            {/* Title & Subtitle */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              {currentSlideData.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              {currentSlideData.subtitle}
            </p>

            {/* Price */}
            <div className="flex items-center gap-3 mb-8">
              {currentSlideData.originalPrice ? (
                <>
                  <span className="text-2xl font-bold text-white">
                    {currentSlideData.price}
                  </span>
                  <span className="text-lg text-white/60 line-through">
                    {currentSlideData.originalPrice}
                  </span>
                  <Badge variant="destructive" className="text-sm">
                    Save{' '}
                    {Math.round(
                      ((parseFloat(currentSlideData.originalPrice.replace('$', '')) - 
                        parseFloat(currentSlideData.price.replace('$', ''))) /
                       parseFloat(currentSlideData.originalPrice.replace('$', ''))) * 100
                    )}%
                  </Badge>
                </>
              ) : (
                <span className="text-2xl font-bold text-white">
                  {currentSlideData.price}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary-hover hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {currentSlideData.price === "Free" ? "Play Now" : "Buy Now"}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <Play className="mr-2 h-4 w-4" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white/40'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
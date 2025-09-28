import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Play, ShoppingCart } from "lucide-react";
import eldenRingHero from "@/assets/elden-ring-hero.png";
import genshinImpactCover from "@/assets/genshin-impact-cover.png";
import cosmicWarfareCover from "@/assets/cosmic-warfare-cover.png";
import fortniteCover from "@/assets/fortnite-cover.png";
import minecraftCover from "@/assets/minecraft-cover.png";

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
      image: genshinImpactCover,
      price: "Free",
      originalPrice: null,
      badge: "Free to Play",
    },
    {
      title: "Cosmic Warfare",
      subtitle: "Command fleets in epic space battles across the galaxy",
      image: cosmicWarfareCover,
      price: "$49.99",
      originalPrice: "$59.99",
      badge: "New Release",
    },
    {
      title: "Fortnite",
      subtitle: "Battle Royale with building mechanics",
      image: fortniteCover,
      price: "Free",
      originalPrice: null,
      badge: "Most Popular",
    },
    {
      title: "Minecraft",
      subtitle: "Build, explore, and survive in infinite worlds",
      image: minecraftCover,
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
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-2xl group">
      {/* Background Image with enhanced animations */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out transform group-hover:scale-105"
        style={{ backgroundImage: `url(${currentSlideData.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Animated particles overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-1 h-1 bg-accent rounded-full animate-ping"></div>
        <div className="absolute bottom-20 left-32 w-1.5 h-1.5 bg-gaming-success rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-20 right-40 w-1 h-1 bg-gaming-warning rounded-full animate-ping delay-500"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl animate-fade-in transform transition-all duration-700 hover:translate-x-2">
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

            {/* Title & Subtitle with enhanced animations */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight transform transition-all duration-500 hover:scale-105 hover:text-primary">
              {currentSlideData.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 transform transition-all duration-300 hover:text-white">
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

            {/* Action Buttons with enhanced effects */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary-hover hover:shadow-2xl hover:scale-105 transition-all duration-300 transform hover:-translate-y-1"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {currentSlideData.price === "Free" ? "Play Now" : "Buy Now"}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm"
              >
                <Play className="mr-2 h-4 w-4" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows with enhanced styling */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 backdrop-blur-sm border border-white/20"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 backdrop-blur-sm border border-white/20"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Slide Indicators with enhanced styling */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-125 ${
              index === currentSlide 
                ? 'bg-white shadow-lg scale-110' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
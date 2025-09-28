import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus,
  CreditCard,
  Gift,
  Tag,
  ArrowRight,
  Shield,
  Clock
} from "lucide-react";
import Header from "@/components/layout/Header";

interface CartItem {
  id: string;
  title: string;
  developer: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  type: 'game' | 'dlc' | 'premium';
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      title: "Elden Ring",
      developer: "FromSoftware",
      image: "/game-1.jpg",
      price: 39.99,
      originalPrice: 59.99,
      quantity: 1,
      type: 'game'
    },
    {
      id: "2",
      title: "Genshin Impact - Welkin Moon",
      developer: "miHoYo",
      image: "/game-2.jpg",
      price: 4.99,
      quantity: 2,
      type: 'premium'
    },
    {
      id: "3",
      title: "Valorant - Agent Pack",
      developer: "Riot Games",
      image: "/game-3.jpg",
      price: 19.99,
      originalPrice: 24.99,
      quantity: 1,
      type: 'dlc'
    }
  ]);

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save10") {
      setAppliedPromo("SAVE10");
      setPromoCode("");
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + ((item.originalPrice - item.price) * item.quantity);
    }
    return sum;
  }, 0);
  const promoDiscount = appliedPromo ? subtotal * 0.1 : 0;
  const tax = (subtotal - promoDiscount) * 0.08; // 8% tax
  const total = subtotal - promoDiscount + tax;

  const recommendedItems = [
    {
      id: "rec1",
      title: "Cyberpunk 2077",
      price: 29.99,
      originalPrice: 59.99,
      image: "/game-4.jpg"
    },
    {
      id: "rec2", 
      title: "The Witcher 3",
      price: 19.99,
      originalPrice: 39.99,
      image: "/game-5.jpg"
    }
  ];

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Discover amazing games and start building your collection!</p>
            <Button size="lg" onClick={() => window.location.href = "/"}>
              Browse Games
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">{cartItems.length} items in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-24 h-32 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.developer}</p>
                          <Badge 
                            variant="secondary" 
                            className="mt-1 text-xs"
                          >
                            {item.type === 'game' ? 'Game' : item.type === 'dlc' ? 'DLC' : 'Premium'}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {item.originalPrice && (
                            <span className="text-sm line-through text-muted-foreground">
                              ${item.originalPrice}
                            </span>
                          )}
                          <span className="text-lg font-semibold">
                            ${item.price}
                          </span>
                          {item.originalPrice && (
                            <Badge variant="destructive" className="text-xs">
                              -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-right">
                        <span className="text-sm text-muted-foreground">
                          Subtotal: ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Recommended Items */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>You might also like</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendedItems.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 border border-border rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs line-through text-muted-foreground">
                            ${item.originalPrice}
                          </span>
                          <span className="text-sm font-semibold">${item.price}</span>
                        </div>
                        <Button size="sm" variant="outline" className="w-full text-xs">
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Promo Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Promo Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button variant="outline" onClick={applyPromoCode}>
                    Apply
                  </Button>
                </div>
                {appliedPromo && (
                  <div className="mt-3 p-2 bg-gaming-success/20 text-gaming-success text-sm rounded">
                    ✓ Promo code "{appliedPromo}" applied! 10% off
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                {savings > 0 && (
                  <div className="flex justify-between text-sm text-gaming-success">
                    <span>You save</span>
                    <span>-${savings.toFixed(2)}</span>
                  </div>
                )}
                
                {appliedPromo && (
                  <div className="flex justify-between text-sm text-gaming-success">
                    <span>Promo discount (10%)</span>
                    <span>-${promoDiscount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                <Button className="w-full mt-4" size="lg">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-4">
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Secure Payment
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Instant Access
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>We Accept</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {['💳', '📱', '💰'].map((icon, index) => (
                    <div key={index} className="p-2 border border-border rounded text-center">
                      <span className="text-lg">{icon}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Credit Cards, PayPal, Digital Wallets
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
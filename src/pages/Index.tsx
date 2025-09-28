import Header from "@/components/layout/Header";
import ScrollingBanner from "@/components/store/ScrollingBanner";
import SearchBar from "@/components/store/SearchBar";
import HeroBanner from "@/components/store/HeroBanner";
import FilterSidebar from "@/components/store/FilterSidebar";
import GameGrid from "@/components/store/GameGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ScrollingBanner />
      
      <main className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <SearchBar />

        {/* Hero Banner */}
        <section className="mb-12">
          <HeroBanner />
        </section>

        {/* Store Section */}
        <section className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Discover Games</h2>
                <p className="text-muted-foreground">
                  Browse our collection of premium games and find your next adventure
                </p>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Showing 1,247 games</span>
              </div>
            </div>

            <GameGrid />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;

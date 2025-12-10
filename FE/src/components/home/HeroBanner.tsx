import { Search, Sparkles } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";

interface HeroBannerProps {
  onSearch?: (query: string) => void;
}

export function HeroBanner({ onSearch }: HeroBannerProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    if (searchValue.trim() && onSearch) {
      onSearch(searchValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePopularClick = (term: string) => {
    if (onSearch) {
      onSearch(term);
    }
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card via-card to-secondary/20 p-12 lg:p-20">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#fbbf24]/10 to-[#f59e0b]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#fbbf24]/5 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-secondary/30 backdrop-blur-sm px-4 py-2">
          <Sparkles className="h-4 w-4 text-[#fbbf24]" />
          <span className="text-muted-foreground">
            Discover Rare & Exclusive Items
          </span>
        </div>

        {/* Heading */}
        <div className="space-y-4">
          <h1 className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
            Bid on the World's Most Coveted Items
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            Join thousands of collectors and enthusiasts in live auctions. Find
            luxury watches, rare art, vintage cars, and exclusive collectibles.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for watches, arts, cars and more..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-14 pl-12 pr-4 bg-background/50 backdrop-blur-sm border-border/50 rounded-xl"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="h-14 px-8 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90 rounded-xl"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Popular Searches */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-gray-300">Popular:</span>
          {[
            "Rolex",
            "Modern Art",
            "Diamond Jewelry",
            "Camera",
            "Watches",
            "Clothing",
          ].map((term) => (
            <button
              key={term}
              onClick={() => handlePopularClick(term)}
              className="rounded-lg border border-[#fbbf24]/30 bg-[#1a1a1a]/50 hover:bg-[#fbbf24]/20 hover:border-[#fbbf24]/50 px-3 py-1.5 text-sm text-gray-200 hover:text-[#fbbf24] transition-all"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

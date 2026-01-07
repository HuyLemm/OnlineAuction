import { useEffect, useState } from "react";
import {
  Watch,
  Palette,
  Car,
  Gem,
  Camera,
  ShoppingBag,
  Armchair,
  Smartphone,
  Trophy,
} from "lucide-react";
import { ImageWithFallback } from "../check/ImageWithFallback";
import type { CategoryDTO } from "../../types/database";
import { GET_MAIN_CATEGORIES_API } from "../utils/api";

const categoryIcons: Record<string, React.ReactNode> = {
  Watches: <Watch className="h-6 w-6" />,
  Jewelry: <Gem className="h-6 w-6" />,
  Collectibles: <Camera className="h-6 w-6" />,
  Vehicles: <Car className="h-6 w-6" />,
  Sports: <Trophy className="h-6 w-6" />,
  Fashion: <ShoppingBag className="h-6 w-6" />,
  "Home & Garden": <Armchair className="h-6 w-6" />,
  Electronics: <Smartphone className="h-6 w-6" />,
  Art: <Palette className="h-6 w-6" />,
};

const categoryImages: Record<string, string> = {
  Watches: "/images/Watches.jpg",
  Jewelry: "/images/Jewelry.jpg",
  Collectibles: "/images/Collectibles.jpg",
  Vehicles: "/images/Vehicles.jpg",
  Sports: "/images/Sports.jpg",
  Fashion: "/images/Fashion.jpg",
  "Home & Garden": "/images/Home&Garden.jpg",
  Electronics: "/images/Electronics.jpg",
};

interface CategoryGridProps {
  onCategoryClick?: (category: string) => void;
}

export function CategoryGrid({ onCategoryClick }: CategoryGridProps) {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(GET_MAIN_CATEGORIES_API);
        const json = await res.json();

        const formatted: CategoryDTO[] = json.data.map((cat: CategoryDTO) => ({
          ...cat,
          icon: categoryIcons[cat.name] || <Palette className="h-6 w-6" />,
          image: categoryImages[cat.name] || "/images/Placeholder.jpg",
        }));

        setCategories(formatted);
      } catch (error) {
        console.error("❌ Failed to load categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground">Browse by Category</h2>
          <p className="text-muted-foreground mt-1">
            Explore our curated collections
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick?.(String(category.id))}
            className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 
                       hover:border-[#fbbf24]/30 transition-all duration-300 hover:shadow-xl 
                       hover:shadow-[#fbbf24]/10 hover:bg-card"
          >
            {/* Background */}
            <div className="aspect-square relative overflow-hidden">
              <ImageWithFallback
                src={category.image || "/images/Placeholder.jpg"}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-2 text-[#fbbf24]">
                  {category.icon}
                </div>

                <h3 className="text-white mb-1">{category.name}</h3>
                <p className="text-white/80">{category.count} items</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

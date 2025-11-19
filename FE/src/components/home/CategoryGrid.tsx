import { Watch, Palette, Car, Gem, Camera, ShoppingBag, Armchair, Trophy } from "lucide-react";
import { ImageWithFallback } from "../check/ImageWithFallback";

interface Category {
  name: string;
  icon: React.ReactNode;
  image: string;
  count: number;
}

export function CategoryGrid() {
  const categories: Category[] = [
    {
      name: "Watches",
      icon: <Watch className="h-6 w-6" />,
      image: "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NjMzOTExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      count: 234
    },
    {
      name: "Art",
      icon: <Palette className="h-6 w-6" />,
      image: "https://images.unsplash.com/photo-1558522195-e1201b090344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcnR8ZW58MXx8fHwxNzYzMzc4ODkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      count: 189
    },
    {
      name: "Vintage Cars",
      icon: <Car className="h-6 w-6" />,
      image: "https://images.unsplash.com/photo-1604940500627-d3f44d1d21c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2FyfGVufDF8fHx8MTc2MzM5MDY2Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      count: 67
    },
    {
      name: "Jewelry",
      icon: <Gem className="h-6 w-6" />,
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5fGVufDF8fHx8MTc2MzM5OTk0NXww&ixlib=rb-4.1.0&q=80&w=1080",
      count: 156
    },
    {
      name: "Collectibles",
      icon: <Camera className="h-6 w-6" />,
      image: "https://images.unsplash.com/photo-1693292918414-3e0f37ef8271?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwY2FtZXJhfGVufDF8fHx8MTc2MzQwMDE5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      count: 312
    },
    {
      name: "Fashion",
      icon: <ShoppingBag className="h-6 w-6" />,
      image: "https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoYW5kYmFnfGVufDF8fHx8MTc2MzMwNTk3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      count: 428
    },
    {
      name: "Furniture",
      icon: <Armchair className="h-6 w-6" />,
      image: "https://images.unsplash.com/photo-1544691560-fc2053d97726?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpcXVlJTIwZnVybml0dXJlfGVufDF8fHx8MTc2MzM5MTA2N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      count: 145
    },
    {
      name: "Sports",
      icon: <Trophy className="h-6 w-6" />,
      image: "https://images.unsplash.com/photo-1512144825472-b4d1e4cdeb68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBtZW1vcmFiaWxpYXxlbnwxfHx8fDE3NjMzOTEwNjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      count: 98
    }
  ];

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground">Browse by Category</h2>
          <p className="text-muted-foreground mt-1">Explore our curated collections</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <button
            key={category.name}
            className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 hover:border-[#fbbf24]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#fbbf24]/10 hover:bg-card"
          >
            {/* Background Image */}
            <div className="aspect-square relative overflow-hidden">
              <ImageWithFallback
                src={category.image}
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
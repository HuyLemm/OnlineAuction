import { useState } from "react";
import { ImageWithFallback } from "../check/ImageWithFallback";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Button } from "../ui/button";

interface ImageGalleryProps {
  images?: string[];
  title?: string;
}

export function ImageGallery({ 
  images = [
    "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    "https://images.unsplash.com/photo-1614252368970-5b2f0d5a8a06?w=800&q=80",
    "https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=800&q=80",
    "https://images.unsplash.com/photo-1587836374228-4c4c1e0e8e8f?w=800&q=80"
  ],
  title = "Luxury Watch" 
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-card border border-border/50 group">
        <ImageWithFallback
          src={images[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          className="h-full w-full object-cover"
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-black/80 text-white border-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-black/80 text-white border-0"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Expand Button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-black/80 text-white border-0"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? "border-[#fbbf24] ring-2 ring-[#fbbf24]/20"
                  : "border-border/50 hover:border-border"
              }`}
            >
              <ImageWithFallback
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
              {index !== currentIndex && (
                <div className="absolute inset-0 bg-black/40" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
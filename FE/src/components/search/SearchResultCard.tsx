import { Clock, TrendingUp } from "lucide-react";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../check/ImageWithFallback";
import { RelativeTimeCompact } from "../ui/RelativeTimeDisplay";
import { NewBadge } from "../ui/NewBadge";

export interface SearchResult {
  id: string;
  title: string;
  image: string;
  currentBid: number;
  bidCount: number;
  endTime: Date;
  category: string;
  postedDate?: Date | string; // Accept both Date and string
  seller: string;
}

interface SearchResultCardProps {
  item: SearchResult;
  searchKeyword?: string;
  onClick?: () => void;
}

export function SearchResultCard({ item, searchKeyword, onClick }: SearchResultCardProps) {
  // Calculate time remaining
  const now = new Date();
  const diff = item.endTime.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  // Format time remaining as string for RelativeTimeDisplay
  let timeRemaining = "";
  if (days > 0) {
    timeRemaining = `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    timeRemaining = `${hours}h ${minutes}m`;
  } else {
    timeRemaining = `${minutes}m`;
  }

  // Highlight keyword in title
  const highlightText = (text: string, keyword?: string) => {
    if (!keyword) return text;
    
    const parts = text.split(new RegExp(`(${keyword})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <mark key={index} className="bg-[#fbbf24]/30 text-[#fbbf24] px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div
      onClick={onClick}
      className="group relative bg-[#1a1a1a] rounded-xl border border-[#fbbf24]/20 overflow-hidden hover:border-[#fbbf24]/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-[#fbbf24]/10 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
        <ImageWithFallback
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Bottom Overlay - Time + NEW Badge */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <div className="flex-shrink-0 rounded-md bg-black/70 backdrop-blur-sm px-1.5 py-0.5">
            <RelativeTimeCompact timeLeft={timeRemaining} className="text-white" />
          </div>
          {item.postedDate && (
            <NewBadge postedDate={item.postedDate} daysThreshold={7} variant="minimal" />
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title with keyword highlighting */}
        <h3 className="line-clamp-2 text-white group-hover:text-[#fbbf24] transition-colors">
          {highlightText(item.title, searchKeyword)}
        </h3>

        {/* Category */}
        <p className="text-sm text-gray-400">{item.category}</p>

        {/* Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div>
            <p className="text-xs text-gray-500">Current Bid</p>
            <p className="text-[#fbbf24] flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              ${item.currentBid.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Bids</p>
            <p className="text-white">{item.bidCount}</p>
          </div>
        </div>
      </div>

      {/* Hover Effect Border Glow */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute inset-0 rounded-xl ring-1 ring-[#fbbf24]/50" />
      </div>
    </div>
  );
}
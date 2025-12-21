import { useState, useEffect } from "react";
import { Clock, TrendingUp, Grid3x3, List } from "lucide-react";
import { Button } from "../ui/button";
import { AuctionCard } from "../auction/AuctionCard";
import { AuctionListItem } from "../browse/AuctionListItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  GET_WATCHLIST_API,
  REMOVE_FROM_WATCHLIST_API,
  REMOVE_MANY_FROM_WATCHLIST_API,
} from "../utils/api";
import { calculateTimeLeft } from "../utils/timeUtils";
import { LoadingSpinner } from "../state";

import { fetchWithAuth } from "../utils/fetchWithAuth";

/* ================= TYPES ================= */

interface WatchlistItem {
  id: string;
  title: string;
  category: string;
  categoryId: number;
  image: string;
  description: string;
  postedDate: string;
  end_time: string;

  auctionType: "traditional" | "buy_now";
  buyNowPrice?: string | null;

  currentBid: number;
  bids: number;

  highestBidderId?: string | null;
  highestBidderName?: string | null;

  isHot: boolean;
  endingSoon: boolean;
}

/* ================= COMPONENT ================= */

export function WatchlistSection() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("all");

  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔘 Select mode
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  /* ================= FETCH WATCHLIST ================= */

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await fetchWithAuth(GET_WATCHLIST_API);
        const json = await res.json();

        const items = Array.isArray(json)
          ? json
          : Array.isArray(json.data)
          ? json.data
          : [];

        setWatchlistItems(items);
      } catch (err) {
        console.error("Fetch watchlist error:", err);
        setWatchlistItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);
  /* ================= SELECT ================= */

  const toggleSelect = (id: string) => {
    if (!isSelecting) return;

    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  /* ================= REMOVE ================= */

  const removeSelected = async () => {
    if (selectedIds.size === 0) return;

    const ids = Array.from(selectedIds);

    try {
      if (ids.length === 1) {
        await fetchWithAuth(`${REMOVE_FROM_WATCHLIST_API}/${ids[0]}`, {
          method: "DELETE",
        });
      } else {
        await fetchWithAuth(REMOVE_MANY_FROM_WATCHLIST_API, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productIds: ids }),
        });
      }

      setWatchlistItems((prev) =>
        prev.filter((item) => !selectedIds.has(item.id))
      );

      setSelectedIds(new Set());
      setIsSelecting(false);
    } catch (err) {
      console.error("Remove watchlist error:", err);
    }
  };

  /* ================= FILTER ================= */

  const endingSoonItems = watchlistItems.filter(
    (item) => item.endingSoon === true
  );

  const highValueItems = watchlistItems.filter((item) => item.isHot === true);

  const filteredItems =
    activeTab === "ending-soon"
      ? endingSoonItems
      : activeTab === "high-value"
      ? highValueItems
      : watchlistItems;

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <LoadingSpinner />
      </div>
    );
  }

  /* ================= RENDER ================= */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-foreground mb-2">Watchlist</h1>
          <p className="text-muted-foreground">
            Keep track of items you're interested in
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isSelecting ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSelecting(true)}
            >
              Select
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsSelecting(false);
                  setSelectedIds(new Set());
                }}
              >
                Cancel
              </Button>

              {selectedIds.size > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={removeSelected}
                >
                  Remove ({selectedIds.size})
                </Button>
              )}
            </>
          )}

          {/* View toggle */}
          <div className="flex items-center gap-1 rounded-lg bg-secondary/50 border border-border/50 p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className={`h-8 w-8 ${
                viewMode === "grid" ? "bg-[#fbbf24]/10 text-[#fbbf24]" : ""
              }`}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className={`h-8 w-8 ${
                viewMode === "list" ? "bg-[#fbbf24]/10 text-[#fbbf24]" : ""
              }`}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<TrendingUp className="h-6 w-6 text-[#fbbf24]" />}
          label="Total Watching"
          value={`${watchlistItems.length} Items`}
        />
        <StatCard
          icon={<Clock className="h-6 w-6 text-[#ef4444]" />}
          label="Ending Soon"
          value={`${endingSoonItems.length} Items`}
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6 text-[#8b5cf6]" />}
          label="High Value"
          value={`${highValueItems.length} Items`}
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary/50 border border-border/50">
          <TabsTrigger value="all">All ({watchlistItems.length})</TabsTrigger>
          <TabsTrigger value="ending-soon">
            Ending Soon ({endingSoonItems.length})
          </TabsTrigger>
          <TabsTrigger value="high-value">
            High Value ({highValueItems.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`relative group ${
                    isSelecting && selectedIds.has(item.id)
                      ? "ring-2 ring-red-500 rounded-xl"
                      : ""
                  }`}
                >
                  {isSelecting && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(item.id);
                      }}
                      className={`absolute top-2 right-2 z-10 h-10 w-10 rounded-full border
                        ${
                          selectedIds.has(item.id)
                            ? " bg-black/50 border-white/70"
                            : " bg-red-500 border-red-500"
                        }`}
                    >
                      {selectedIds.has(item.id) && (
                        <span className="block h-full w-full text-[#fbbf24] text-3xl leading-5 font-bold text-center">
                          ✓
                        </span>
                      )}
                    </button>
                  )}

                  <AuctionCard
                    id={item.id}
                    title={item.title}
                    image={item.image}
                    category={item.category}
                    currentBid={item.currentBid}
                    bids={item.bids}
                    end_time={item.end_time}
                    isHot={item.isHot}
                    endingSoon={item.endingSoon}
                    isFavorite
                    onToggleFavorite={() => {}}
                    hideFavorite
                    postedDate={item.postedDate}
                    auctionType={item.auctionType}
                    showCategory
                    highestBidderName={item.highestBidderName}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`relative group ${
                    isSelecting && selectedIds.has(item.id)
                      ? "ring-2 ring-red-500 rounded-xl"
                      : ""
                  }`}
                >
                  {isSelecting && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(item.id);
                      }}
                      className={`absolute top-4 right-4 z-10 h-10 w-10 rounded-full border
                        ${
                          selectedIds.has(item.id)
                            ? "bg-black/50 border-white/70s"
                            : "bg-red-500 border-red-500"
                        }`}
                    >
                      {selectedIds.has(item.id) && (
                        <span className="block h-full w-full text-[#fbbf24] text-3xl leading-5 text-center">
                          ✓
                        </span>
                      )}
                    </button>
                  )}

                  <AuctionListItem
                    id={item.id}
                    title={item.title}
                    image={item.image}
                    currentBid={item.currentBid}
                    bids={item.bids}
                    timeLeft={calculateTimeLeft(item.end_time)}
                    description={item.description}
                    category={item.category}
                    isHot={item.isHot}
                    endingSoon={item.endingSoon}
                  />
                </div>
              ))}
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No items in this category
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-card border border-border/50 rounded-xl p-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-lg bg-secondary/40 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-muted-foreground">{label}</p>
          <p className="text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
}

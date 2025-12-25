import { useEffect, useState } from "react";
import { Edit, Eye, Clock } from "lucide-react";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../check/ImageWithFallback";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { GET_ACTIVE_LISTINGS_API, APPEND_DESCRIPTION_API } from "../utils/api";
import { LoadingSpinner } from "../state";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

/* ===============================
 * Backend type
 * =============================== */
interface SellerActiveProduct {
  id: string;
  title: string;
  category: string;
  description: string;

  startingBid: number;
  currentBid: number;
  bid_count: string;
  bid_step: number;

  buyNowPrice: number | null;

  image: string | null;

  endDate: string;
  timeLeft: number;
}

/* ===============================
 * Utils
 * =============================== */
function formatTimeLeft(seconds: number): string {
  if (seconds <= 0) return "Ended";

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);

  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
}

interface ActiveAuctionsProps {
  onCreate: () => void;
  onCountChange?: (count: number) => void;
}

/* ===============================
 * Component
 * =============================== */
export function ActiveAuctions({
  onCreate,
  onCountChange,
}: ActiveAuctionsProps) {
  const navigate = useNavigate();
  const [activeListings, setActiveListings] = useState<SellerActiveProduct[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // ===== append description state =====
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<SellerActiveProduct | null>(null);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ===============================
   * Fetch data
   * =============================== */
  async function fetchListings() {
    try {
      const res = await fetchWithAuth(GET_ACTIVE_LISTINGS_API);
      const json: {
        success: boolean;
        data: SellerActiveProduct[];
      } = await res.json();
      setActiveListings(json.data);
      onCountChange?.(json.data.length);
    } catch (err) {
      console.error("Failed to fetch active listings", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchListings();
  }, []);

  /* ===============================
   * Append description
   * =============================== */
  async function handleAppend() {
    if (!target || !content.trim()) {
      toast.error("Content is required");
      return;
    }

    try {
      setSubmitting(true);

      await fetchWithAuth(APPEND_DESCRIPTION_API(target.id), {
        method: "POST",
        body: JSON.stringify({ content }),
      });

      toast.success("Description appended");
      setOpen(false);
      setContent("");
      setTarget(null);

      // reload
      fetchListings();
    } catch (err: any) {
      toast.error(err.message || "Failed to update description");
    } finally {
      setSubmitting(false);
    }
  }

  /* ===============================
   * Card
   * =============================== */
  const ListingCard = ({ item }: { item: SellerActiveProduct }) => (
    <div className="bg-card border border-border/50 rounded-xl p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="md:col-span-2 space-y-4">
          <div className="border border-border/50 rounded-lg p-4">
            <div className="flex gap-4">
              <div className="relative w-40 h-40 rounded-lg overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src={item.image ?? ""}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-[#10b981] text-white border-0">
                    Active
                  </Badge>
                </div>
              </div>

              <div className="flex-1 space-y-3 min-w-0">
                <div>
                  <Badge
                    variant="outline"
                    className="border-border/50 text-muted-foreground mb-2"
                  >
                    {item.category}
                  </Badge>
                  <h3 className="text-foreground line-clamp-1">{item.title}</h3>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  <div>
                    <p className="text-muted-foreground">Starting Bid</p>
                    <p className="text-foreground">
                      ${item.startingBid.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Bids step</p>
                    <p className="text-foreground">
                      ${item.bid_step.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Current Bid</p>
                    <p className="text-[#fbbf24]">
                      ${item.currentBid.toLocaleString()}
                    </p>
                  </div>
                  {item.buyNowPrice && (
                    <div>
                      <p className="text-muted-foreground">Buy Now</p>
                      <p className="text-[#10b981]">
                        ${item.buyNowPrice.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {formatTimeLeft(item.timeLeft)}
                  </div>
                  <div>Ends: {new Date(item.endDate).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="border border-border/50 rounded-lg p-3 flex gap-2">
            <Button
              onClick={() => navigate(`/product/${item.id}`)}
              variant="outline"
              size="lg"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Auction
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                setTarget(item);
                setOpen(true);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Append Description
            </Button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="md:col-span-1 border border-border/50 rounded-lg p-4">
          <p className="text-yellow-500 text-lg font-semibold mb-2">
            Description
          </p>
          <div
            className="prose prose-sm max-w-none text-muted-foreground description-content"
            dangerouslySetInnerHTML={{ __html: item.description }}
          />
        </div>
      </div>
    </div>
  );

  /* ===============================
   * Loading
   * =============================== */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-yellow-500 mb-2 text-2xl">
              {activeListings.length === 0 ? (
                "No Auctions Available"
              ) : (
                <>
                  Active Auctions{" "}
                  <span className="text-foreground text-lg font-normal">
                    (Total: {activeListings.length}{" "}
                    {activeListings.length === 1 ? "auction" : "auctions"})
                  </span>
                </>
              )}
            </h1>
            <p className="text-muted-foreground">
              View and manage your active auctions
            </p>
          </div>
          <Button
            onClick={onCreate}
            className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black"
          >
            Create new Auction
          </Button>
        </div>

        <div className="space-y-4">
          {activeListings.map((item) => (
            <ListingCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {open && target && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-card border border-border/50 rounded-xl w-full max-w-lg p-6 space-y-4">
            <h2 className="text-foreground">Append description</h2>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full rounded-md bg-background border border-border p-2 text-sm text-foreground"
              placeholder="Enter new description content..."
            />

            <p className="text-xs text-muted-foreground">
              This content will be appended with the current date.
            </p>

            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setOpen(false);
                  setTarget(null);
                  setContent("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAppend} disabled={submitting}>
                {submitting ? "Saving..." : "Append"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

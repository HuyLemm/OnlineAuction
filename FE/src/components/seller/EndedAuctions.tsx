import { useEffect, useState } from "react";
import { Eye, ThumbsUp, ThumbsDown, Star } from "lucide-react";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../check/ImageWithFallback";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { GET_ENDED_LISTINGS_API, RATE_WINNER_API } from "../utils/api";
import { LoadingSpinner } from "../state";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

/* ===============================
 * Backend type
 * =============================== */
interface SellerEndedAuction {
  id: string;
  title: string;

  current_price: string;
  end_time: string;

  buyer_id: string;
  buyer_name: string;

  buyer_rating_score: string;
  buyer_rating_total: string;

  // ⬇️ thêm 2 field này (backend nên trả)
  my_rating_score?: number | null;
  my_rating_comment?: string | null;

  image: string | null;
}

/* ===============================
 * Utils
 * =============================== */
function formatDate(dateISO: string) {
  return new Date(dateISO).toLocaleString();
}

interface EndedAuctionsProps {
  onCountChange: (count: number) => void;
}

/* ===============================
 * Component
 * =============================== */
export function EndedAuctions({ onCountChange }: EndedAuctionsProps) {
  const navigate = useNavigate();

  const [items, setItems] = useState<SellerEndedAuction[]>([]);
  const [loading, setLoading] = useState(true);

  // ===== rating modal =====
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<SellerEndedAuction | null>(null);
  const [score, setScore] = useState<1 | -1 | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function fetchEnded() {
    try {
      const res = await fetchWithAuth(GET_ENDED_LISTINGS_API);
      const json: { success: boolean; data: SellerEndedAuction[] } =
        await res.json();
      setItems(json.data);
      onCountChange?.(json.data.length);
    } catch (err) {
      console.error("Failed to fetch ended auctions", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEnded();
  }, []);

  /* ===============================
   * Submit rating (create OR update)
   * =============================== */
  async function submitRating() {
    if (!target || !score || !comment.trim()) {
      toast.error("Score and comment are required");
      return;
    }

    try {
      setSubmitting(true);

      await fetchWithAuth(RATE_WINNER_API(target.id), {
        method: "POST",
        body: JSON.stringify({
          score,
          comment,
        }),
      });

      toast.success("Rating saved");
      setOpen(false);
      setTarget(null);
      setScore(null);
      setComment("");

      fetchEnded();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  }

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
        <div>
          <h1 className="text-yellow-500 mb-2 text-2xl">
            {items.length === 0 ? (
              "No Auctions Available"
            ) : (
              <>
                Active Auctions{" "}
                <span className="text-foreground text-lg font-normal">
                  (Total: {items.length}{" "}
                  {items.length === 1 ? "auction" : "auctions"})
                </span>
              </>
            )}
          </h1>

          <p className="text-muted-foreground">
            Auctions with a winning bidder
          </p>
        </div>

        <div className="space-y-4">
          {items.map((item) => {
            const ratingScore = Number(item.buyer_rating_score);
            const ratingTotal = Number(item.buyer_rating_total);

            const myScore = item.my_rating_score;

            return (
              <div
                key={item.id}
                className="bg-card border border-border/50 rounded-xl p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ================= LEFT ================= */}
                  <div className="space-y-4">
                    <div className="border border-border/50 rounded-lg p-4">
                      <div className="flex gap-4">
                        <div className="relative w-40 h-40 rounded-lg overflow-hidden">
                          <ImageWithFallback
                            src={item.image ?? ""}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-[#6b7280] text-white">
                              Ended
                            </Badge>
                          </div>
                        </div>

                        <div className="flex-1 space-y-3">
                          <h3 className="text-lg text-foreground">
                            {item.title}
                          </h3>

                          <div>
                            <p className="text-muted-foreground text-sm">
                              Final Price
                            </p>
                            <p className="text-[#fbbf24] text-xl font-semibold">
                              ${Number(item.current_price).toLocaleString()}
                            </p>
                          </div>

                          <div className="text-sm text-muted-foreground">
                            Ended at: {formatDate(item.end_time)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Auction
                    </Button>
                  </div>

                  {/* ================= RIGHT ================= */}
                  <div className="border border-border/50 rounded-lg p-5 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div>
                        <p className="text-yellow-500 text-lg">Winner</p>
                        <p className="text-foreground font-medium">
                          {item.buyer_name}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground mb-1">
                          Buyer Rating
                        </p>
                        <div className="flex items-center gap-3">
                          <Star
                            className="h-6 w-6 text-yellow-500"
                            fill="currentColor"
                          />
                          <div>
                            <span className="text-foreground text-lg font-medium">
                              {ratingScore >= 0 ? "+" : ""}
                              {ratingScore}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {" "}
                              ({ratingTotal} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-3 mt-6">
                      <Button
                        variant={myScore === 1 ? "default" : "outline"}
                        size="lg"
                        className="flex-1"
                        onClick={() => {
                          setTarget(item);
                          setScore(1);
                          setComment("");
                          setOpen(true);
                        }}
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        +1
                      </Button>

                      <Button
                        variant={myScore === -1 ? "destructive" : "outline"}
                        size="lg"
                        className="flex-1"
                        onClick={() => {
                          setTarget(item);
                          setScore(-1);
                          setComment("");
                          setOpen(true);
                        }}
                      >
                        <ThumbsDown className="h-4 w-4 mr-2" />
                        -1
                      </Button>
                    </div>
                    {item.my_rating_comment && (
                      <div className="mt-3 rounded-md border border-border/50 bg-muted/40 p-3">
                        <p className="text-sm text-yellow-500 mb-1">
                          Your previous comment
                        </p>
                        <p className="text-sm text-foreground">
                          {item.my_rating_comment}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {open && target && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-card border border-border/50 rounded-xl w-full max-w-lg p-6 space-y-4">
            <h2 className="text-yellow-500 text-lg">
              {score === 1 ? "👍 Positive rating" : "👎 Negative rating"}
            </h2>

            <textarea
              rows={5}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-background border border-border rounded-md p-2 text-sm text-foreground"
              placeholder="Enter your comment..."
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setOpen(false);
                  setTarget(null);
                  setScore(null);
                  setComment("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={submitRating} disabled={submitting}>
                {submitting ? "Saving..." : "Save rating"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

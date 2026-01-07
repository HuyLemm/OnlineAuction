import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown, Star } from "lucide-react";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { GET_RATINGS_SUMMARY_API, GET_RATINGS_DETAIL_API } from "../utils/api";
import { LoadingSpinner } from "../state";
import { Separator } from "../ui/separator";
import { useNavigate } from "react-router-dom";

/* ================= TYPES ================= */

interface RatingSummary {
  totalScore: number; // vd: 1
  plus: number; // vd: 2
  minus: number; // vd: 1
  totalVotes: number; // vd: 3
}

interface RatingDetail {
  id: string;
  score: 1 | -1;
  comment: string | null;
  createdAt: string;

  fromUser?: {
    id: string;
    fullName: string;
  };

  product?: {
    id: string;
    title: string;
    image: string;
    category: string;
  };
}

/* ================= COMPONENT ================= */

export function MyReviewsSection() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<RatingSummary | null>(null);
  const [details, setDetails] = useState<RatingDetail[]>([]);
  const navigate = useNavigate();

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [summaryRes, detailRes] = await Promise.all([
          fetchWithAuth(GET_RATINGS_SUMMARY_API),
          fetchWithAuth(GET_RATINGS_DETAIL_API),
        ]);

        if (!summaryRes.ok || !detailRes.ok) {
          throw new Error("Failed to load ratings");
        }

        const summaryJson = await summaryRes.json();
        const detailJson = await detailRes.json();

        setSummary(summaryJson.data);
        setDetails(detailJson.data ?? []);
      } catch {
        // có thể toast nếu muốn
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (!summary) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No ratings yet
      </div>
    );
  }

  const positiveRate =
    summary.totalVotes > 0
      ? Math.round((summary.plus / summary.totalVotes) * 100)
      : 0;

  /* ================= RENDER ================= */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-foreground mb-2">Ratings & Reviews</h1>
        <p className="text-muted-foreground">
          Your reputation based on other sellers's feedback
        </p>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-[#fbbf24]/20 flex items-center justify-center">
              <Star className="h-7 w-7 text-[#fbbf24] fill-current" />
            </div>

            <div>
              <p className="text-yellow-500">Reputation Score</p>
              <p className="text-3xl font-bold text-foreground">
                {positiveRate}%
              </p>
              <p className="text-muted-foreground">
                Based on {summary.totalVotes} reviews
              </p>
            </div>
          </div>

          <div className="flex gap-8">
            <div className="flex items-center gap-2 text-green-500">
              <ThumbsUp className="h-5 w-5" />
              <span className="font-medium">+{summary.plus}</span>
            </div>

            <div className="flex items-center gap-2 text-red-500">
              <ThumbsDown className="h-5 w-5" />
              <span className="font-medium">-{summary.minus}</span>
            </div>
          </div>
        </div>

        {/* ===== Progress bar ===== */}
        <div>
          <div className="flex justify-start text-sm text-muted-foreground mb-1">
            <span className="mr-2">Positive feedback: </span>
            <span className="text-green-500">{positiveRate}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-secondary/40 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#22c55e] to-[#16a34a]"
              style={{ width: `${positiveRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* ================= DETAIL LIST ================= */}
      <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
        {details.length === 0 && (
          <div className="p-6 text-center text-muted-foreground">
            No review details available
          </div>
        )}

        {details.map((r, idx) => (
          <div
            key={r.id}
            className={`grid grid-cols-1 md:grid-cols-2 gap-6 p-6 ${
              idx !== 0 ? "border-t border-[#fbbf24]/40" : ""
            }`}
          >
            {/* ================= LEFT: REVIEW ================= */}
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-yellow-500 font-medium text-lg">
                    {r.fromUser?.fullName ?? "Unknown user"}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div
                  className={`flex items-center gap-1 font-semibold ${
                    r.score === 1 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {r.score === 1 ? (
                    <ThumbsUp className="h-4 w-4" />
                  ) : (
                    <ThumbsDown className="h-4 w-4" />
                  )}
                  {r.score === 1 ? "+1" : "-1"}
                </div>
              </div>

              {r.comment && (
                <p className="text-foreground leading-relaxed">{r.comment}</p>
              )}
            </div>
            {/* ================= RIGHT: PRODUCT ================= */}
            {r.product && (
              <div
                onClick={() => navigate(`/product/${r.product?.id}`)}
                className=" cursor-pointer flex items-center gap-4"
              >
                <div className="h-40 w-40 flex-shrink-0 rounded-lg overflow-hidden border border-border/50">
                  {r.product?.image ? (
                    <img
                      src={r.product.image}
                      alt={r.product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-secondary/40" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-yellow-500 font-semibold text-lg line-clamp-2">
                    {r.product?.title ?? "Unknown product"}
                  </p>
                  <p className="text-muted-foreground">
                    {r.product?.category ?? ""}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

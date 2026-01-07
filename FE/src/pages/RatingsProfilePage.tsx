import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Star,
  Shield,
  Award,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Search,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";

import { fetchWithAuth } from "../components/utils/fetchWithAuth";
import { GET_PROFILE_RATINGS_API } from "../components/utils/api";

import { LoadingSpinner } from "../components/state";

/* ===============================
 * TYPES
 * =============================== */

interface Rating {
  id: string;
  buyerName: string;
  buyerAvatar?: string;
  rating: 1 | -1;
  comment: string;
  date: Date;
  itemTitle: string;
  itemImage: string;
  transactionAmount: number;
  verified: boolean;
}

interface ProfileData {
  id: string;
  name: string;
  role: "seller" | "bidder";
  verified: boolean;
  memberSince: string;
}

interface StatsData {
  totalRatings: number;
  positiveRatings: number;
  negativeRatings: number;
  positivePercentage: number;
  overallScore: number;
  totalTransactions: number;
}

/* ===============================
 * COMPONENT
 * =============================== */

export function RatingsProfilePage() {
  const { role = "seller", userId } = useParams<{
    role: "seller" | "bidder";
    userId: string;
  }>();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"all" | "positive" | "negative">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);

  /* ===============================
   * FETCH DATA
   * =============================== */
  useEffect(() => {
    if (!userId || !role) return;

    const fetchProfileRatings = async () => {
      try {
        setLoading(true);

        const res = await fetchWithAuth(GET_PROFILE_RATINGS_API(role, userId));
        const json = await res.json();
        console.log(json);

        if (!json.success) {
          throw new Error(json.message || "Failed to load profile");
        }

        setProfile(json.data.profile);
        setStats(json.data.stats);

        setRatings(
          json.data.ratings.map((r: any) => ({
            ...r,
            date: new Date(r.date),
          }))
        );
      } catch (err) {
        console.error("Failed to load ratings profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileRatings();
  }, [role, userId]);

  /* ===============================
   * LOADING
   * =============================== */
  if (loading) {
    return (
      <div className="flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!profile || !stats) {
    return (
      <div className="flex justify-center py-20 text-red-500 text-lg font-semibold">
        Profile not found
      </div>
    );
  }

  /* ===============================
   * DERIVED DATA
   * =============================== */
  const {
    totalRatings,
    positiveRatings,
    negativeRatings,
    positivePercentage,
    overallScore,
    totalTransactions,
  } = stats;

  const filteredRatings = ratings.filter((rating) => {
    const matchesFilter =
      filterType === "all" ||
      (filterType === "positive" && rating.rating === 1) ||
      (filterType === "negative" && rating.rating === -1);

    const matchesSearch =
      searchQuery === "" ||
      rating.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rating.itemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rating.buyerName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  /* ===============================
   * RENDER
   * =============================== */
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Back */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* ================= HEADER ================= */}
        <Card className="luxury-card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start ">
            <div className="flex-1 text-center">
              {/* Avatar */}
              <div className="flex justify-center">
                <Avatar className="h-20 w-20 bg-[#d4a446]/20 ">
                  <AvatarImage />
                  <AvatarFallback className="gold-score text-3xl font-semibold">
                    {profile.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Name + icons */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <h1 className="text-foreground">{profile.name}</h1>

                {profile.verified && (
                  <Shield className="h-5 w-5 text-[#10b981]" />
                )}

                <Award className="h-5 w-5 text-[#fbbf24]" />
              </div>

              {/* Badge */}
              <div className="flex justify-center mb-3">
                <Badge className="bg-[#d4a446]/20 text-[#d4a446] border-[#d4a446]/30">
                  {role === "seller" ? "Seller" : "Bidder"} Profile
                </Badge>
              </div>

              {/* Member since */}
              <p className="text-muted-foreground text-sm">
                Member since {new Date(profile.memberSince).getFullYear()}
              </p>
            </div>

            {/* Overall Score */}
            <Card className="gold-score p-6 text-center min-w-[160px]">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="h-6 w-6 text-black fill-black" />
                <span className="text-3xl text-black">
                  {positivePercentage.toFixed(1)}%
                </span>
              </div>
              <p className="text-black/80 text-sm">Positive Rating</p>
              <div className="mt-2 pt-2 border-t border-black/20">
                <p className="text-black text-xl font-bold">+{overallScore}</p>
                <p className="text-black/80 text-xs">Overall Score</p>
              </div>
            </Card>
          </div>

          {/* ================= STATS ================= */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border/50">
            <Stat
              icon={<TrendingUp className="text-yellow-500 fill-yellow-500" />}
              value={totalRatings}
              label="Total Ratings"
            />
            <Stat
              icon={<ThumbsUp className="text-green-400 fill-green-400" />}
              value={positiveRatings}
              label="Positive"
            />
            <Stat
              icon={<ThumbsDown className="text-red-400 fill-red-400" />}
              value={negativeRatings}
              label="Negative"
            />
            <Stat
              icon={<Star className="text-yellow-500 fill-yellow-500" />}
              value={totalTransactions}
              label="Transactions"
            />
          </div>

          {/* ================= DISTRIBUTION ================= */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <h3 className="text-foreground mb-4">Rating Distribution</h3>
            <ProgressRow
              icon={<ThumbsUp className="h-4 w-4 text-green-400" />}
              label="Positive"
              value={positivePercentage}
              count={positiveRatings}
            />
            <ProgressRow
              icon={<ThumbsDown className="h-4 w-4 text-red-400" />}
              label="Negative"
              value={
                totalRatings === 0 ? 0 : (negativeRatings / totalRatings) * 100
              }
              count={negativeRatings}
            />
          </div>
        </Card>

        {/* ================= FILTERS ================= */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            <FilterButton
              active={filterType === "all"}
              onClick={() => setFilterType("all")}
              label={`All (${totalRatings})`}
            />
            <FilterButton
              active={filterType === "positive"}
              onClick={() => setFilterType("positive")}
              label={`Positive (${positiveRatings})`}
              positive
            />
            <FilterButton
              active={filterType === "negative"}
              onClick={() => setFilterType("negative")}
              label={`Negative (${negativeRatings})`}
              negative
            />
          </div>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* ================= LIST ================= */}
        <div className="space-y-4">
          {filteredRatings.length === 0 ? (
            <Card className="p-12 text-center text-muted-foreground">
              No ratings found
            </Card>
          ) : (
            filteredRatings.map((rating) => (
              <RatingCard key={rating.id} rating={rating} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ===============================
 * SUB COMPONENTS
 * =============================== */

function Stat({ icon, value, label }: any) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 mb-1">
        {icon}
        <p className="text-2xl text-foreground">{value}</p>
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function ProgressRow({ icon, label, value, count }: any) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="flex items-center gap-1 w-24">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <Progress value={value} className="flex-1 h-2 rating-progress" />

      <span className="text-sm text-[#d4a446] w-20 text-right font-medium">
        {count} ({value.toFixed(0)}%)
      </span>
    </div>
  );
}

function FilterButton({ active, label, onClick, positive, negative }: any) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={
        active
          ? positive
            ? "filter-active bg-green-500 text-white"
            : negative
            ? "filter-active bg-red-500 text-white"
            : "filter-active"
          : ""
      }
    >
      {label}
    </Button>
  );
}

function RatingCard({ rating }: { rating: Rating }) {
  return (
    <Card className="rating-card p-6">
      <div className="flex gap-4">
        <img
          src={rating.itemImage}
          alt={rating.itemTitle}
          className="w-20 h-20 rounded-lg object-cover"
        />

        <div className="flex-1 space-y-3">
          <div className="flex justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{rating.buyerName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-foreground">{rating.buyerName}</p>
                <p className="text-xs text-muted-foreground">
                  {rating.date.toLocaleDateString()}
                </p>
              </div>
            </div>

            <Badge
              className={
                rating.rating === 1
                  ? "flex items-center gap-1 bg-green-500/20 text-green-400 border border-green-500/30"
                  : "flex items-center gap-1 bg-red-500/20 text-red-400 border border-red-500/30"
              }
            >
              {rating.rating === 1 ? (
                <>
                  <ThumbsUp className="h-3.5 w-3.5 fill-green-400" />
                  Positive
                </>
              ) : (
                <>
                  <ThumbsDown className="h-3.5 w-3.5 fill-red-400" />
                  Negative
                </>
              )}
            </Badge>
          </div>

          <p className="text-lg text-yellow-500">{rating.itemTitle}</p>
          <p className="text-sm text-muted-foreground font-semibold">
            Price: ${rating.transactionAmount.toLocaleString()}
          </p>
          <p className="text-foreground">Comment: {rating.comment}</p>
        </div>
      </div>
    </Card>
  );
}

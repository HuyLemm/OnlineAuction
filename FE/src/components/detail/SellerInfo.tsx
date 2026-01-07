import { Star, MapPin, Shield, Award, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { formatPostedDate } from "../utils/timeUtils";
import { useNavigate } from "react-router-dom";

interface SellerInfoProps {
  sellerId: string;
  name: string;
  avatar?: string;

  rating: {
    score: number;
    total: number;
  };

  totalSales: number;

  positive: {
    rate: number;
    votes: number;
  };

  location: string;
  memberSince: string;

  verified: boolean;
  topRated?: boolean;
}

export function SellerInfo({
  sellerId,
  name,
  avatar,
  rating,
  totalSales,
  positive = { rate: 0, votes: 0 },
  location,
  memberSince,
  verified,
  topRated,
}: SellerInfoProps) {
  const formattedMemberSince = formatPostedDate(memberSince);
  const navigate = useNavigate();

  return (
    <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <Avatar className="h-16 w-16 border-2 border-[#fbbf24]">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-black">
            {name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        {/* Seller Details */}
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-foreground">{name}</h4>
                {verified && <Shield className="h-4 w-4 text-[#10b981]" />}
                {topRated && <Award className="h-4 w-4 text-[#fbbf24]" />}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-1">
                <Star className="h-4 w-4 fill-[#fbbf24] text-[#fbbf24]" />
                <span className="text-foreground">Score: {rating.score}</span>
                <span className="text-muted-foreground">
                  ({rating.total} {rating.total <= 1 ? "vote" : "votes"})
                </span>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {verified && (
              <Badge
                variant="outline"
                className="border-[#10b981]/30 text-[#10b981]"
              >
                Verified Seller
              </Badge>
            )}
            {topRated && (
              <Badge
                variant="outline"
                className="border-[#fbbf24]/30 text-[#fbbf24]"
              >
                Top Rated
              </Badge>
            )}
          </div>

          {/* Location & Member Since */}
          <div className="space-y-1 text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
            <p>Member since {formattedMemberSince}</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Button
        variant="outline"
        className="w-full border-border/50"
        onClick={() => navigate(`/profile/seller/${sellerId}`)}
      >
        <Shield className="h-4 w-4 mr-2" />
        View Legit Seller
      </Button>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
        <div className="text-center">
          <p className="text-foreground">{totalSales}</p>
          <p className="text-muted-foreground">Sales</p>
        </div>

        <div className="text-center">
          <p className="text-foreground">
            {positive.rate}% ({positive.votes} votes)
          </p>
          <p className="text-muted-foreground">Positive</p>
        </div>

        <div className="text-center">
          <p className="text-foreground">24h</p>
          <p className="text-muted-foreground">Response</p>
        </div>
      </div>
    </div>
  );
}

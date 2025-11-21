import { Star, MapPin, Shield, Award, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface SellerInfoProps {
  name: string;
  avatar?: string;
  rating: number;
  totalSales: number;
  location: string;
  memberSince: string;
  verified: boolean;
  topRated?: boolean;
}

export function SellerInfo({
  name,
  avatar,
  rating,
  totalSales,
  location,
  memberSince,
  verified,
  topRated
}: SellerInfoProps) {
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
                {verified && (
                  <Shield className="h-4 w-4 text-[#10b981]" />
                )}
                {topRated && (
                  <Award className="h-4 w-4 text-[#fbbf24]" />
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-[#fbbf24] text-[#fbbf24]" />
                  <span className="text-foreground">{rating}</span>
                  <span className="text-muted-foreground">({totalSales})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {verified && (
              <Badge variant="outline" className="border-[#10b981]/30 text-[#10b981]">
                Verified Seller
              </Badge>
            )}
            {topRated && (
              <Badge variant="outline" className="border-[#fbbf24]/30 text-[#fbbf24]">
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
            <p>Member since {memberSince}</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Button variant="outline" className="w-full border-border/50">
        <MessageCircle className="h-4 w-4 mr-2" />
        Contact Seller
      </Button>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
        <div className="text-center">
          <p className="text-foreground">{totalSales}</p>
          <p className="text-muted-foreground">Sales</p>
        </div>
        <div className="text-center">
          <p className="text-foreground">98.5%</p>
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

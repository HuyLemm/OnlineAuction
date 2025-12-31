import { ShieldCheck, Unlock } from "lucide-react";
import { Badge } from "../ui/badge";

interface Props {
  requirement: "normal" | "qualified";
}

export function AuctionTypeBadge({ requirement }: Props) {
  if (requirement === "normal") {
    return (
      <Badge className="bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 text-lg">
        <Unlock className="h-6 w-6 mr-1" />
        Normal Auction
      </Badge>
    );
  }

  return (
    <Badge className="bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 text-lg">
      <ShieldCheck className="h-6 w-6 mr-1 " />
      Qualified Auction
    </Badge>
  );
}

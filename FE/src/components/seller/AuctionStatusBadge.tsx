import { Badge } from "../ui/badge";
import { Clock, CheckCircle } from "lucide-react";

export function AuctionStatusBadge({
  status,
}: {
  status: "closed" | "expired";
}) {
  if (status === "expired") {
    return (
      <Badge className="bg-red-500/10 text-red-500 border border-red-500">
        <Clock className="h-3 w-3" />
        Expired
      </Badge>
    );
  }

  return (
    <Badge className="bg-green-500 text-emerald-500 border border-green-500">
      <CheckCircle className="h-3 w-3" />
      Closed
    </Badge>
  );
}

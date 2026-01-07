import { useEffect, useState } from "react";
import {
  Store,
  Users,
  Shield,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import {
  REQUEST_BECOME_SELLER_API,
  GET_SELLER_UPGRADE_STATUS_API,
} from "../utils/api";
import { toast } from "sonner";
import { LoadingSpinner } from "../state";

type SellerRequestStatus = "pending" | "approved" | "rejected";

interface SellerUpgradeRequest {
  status: SellerRequestStatus;
  requestedAt: string;
}

export function BecomeSellerSection() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [request, setRequest] = useState<SellerUpgradeRequest | null>(null);
  const [role, setRole] = useState<string | null>(null);

  /* ================= LOAD REQUEST STATUS ================= */
  useEffect(() => {
    const loadRequest = async () => {
      try {
        const res = await fetchWithAuth(GET_SELLER_UPGRADE_STATUS_API);
        const json = await res.json();

        if (json.success) {
          setRequest(json.data.request ?? null);
          setRole(json.data.role ?? null);
        }
      } catch {
        setRequest(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    loadRequest();
  }, []);

  /* ================= SUBMIT REQUEST ================= */
  const handleRequestUpgrade = async () => {
    try {
      setSubmitting(true);

      const res = await fetchWithAuth(REQUEST_BECOME_SELLER_API, {
        method: "POST",
      });
      const json = await res.json();

      if (!res.ok) throw new Error(json.message);

      toast.success("Seller upgrade request submitted");
      setRequest({
        status: "pending",
        requestedAt: new Date().toISOString(),
      });
    } catch (e: any) {
      toast.error(e.message || "Request failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const isPending = request?.status === "pending";
  const isApproved = request?.status === "approved";
  const isRejected = request?.status === "rejected";

  return (
    <div className="space-y-8">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-foreground mb-2">Become a Seller</h1>
        <p className="text-muted-foreground">
          Join thousands of successful sellers on LuxeAuction
        </p>
      </div>

      {/* ================= BENEFITS (GIỮ NGUYÊN TRANG TRÍ) ================= */}
      <div className="bg-gradient-to-br from-[#fbbf24]/10 to-[#f59e0b]/5 border border-[#fbbf24]/20 rounded-xl p-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] flex items-center justify-center">
            <Store className="h-6 w-6 text-black" />
          </div>
          <div>
            <h2 className="text-foreground mb-1">Why Sell on LuxeAuction?</h2>
            <p className="text-muted-foreground">
              Access a global marketplace of premium buyers
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Users, title: "Large Audience" },
            { icon: Shield, title: "Secure Transactions" },
            { icon: TrendingUp, title: "Premium Listings" },
            { icon: DollarSign, title: "Competitive Fees" },
            { icon: CheckCircle, title: "Seller Protection" },
            { icon: Store, title: "Seller Dashboard" },
          ].map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="bg-card/50 rounded-lg p-4 border border-border/50"
              >
                <Icon className="h-5 w-5 text-[#fbbf24] mb-2" />
                <p className="text-foreground">{b.title}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= REQUEST STATUS ================= */}
      <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
        <h2 className="text-foreground">Seller Upgrade Request</h2>

        {/* ROLE */}
        {role && (
          <div>
            <span className="text-muted-foreground text-sm">
              Current role:{" "}
            </span>
            <Badge
              className={
                role === "seller"
                  ? "bg-green-500/20 text-green-500"
                  : "bg-blue-500/20 text-blue-500"
              }
            >
              {role.toUpperCase()}
            </Badge>
          </div>
        )}

        {request ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Requested at: {new Date(request.requestedAt).toLocaleString()}
              </span>
            </div>

            <div>
              {isPending && (
                <Badge className="bg-yellow-500/20 text-yellow-500">
                  Pending approval
                </Badge>
              )}
              {isApproved && (
                <Badge className="bg-green-500/20 text-green-500">
                  Approved – You are now a seller
                </Badge>
              )}
              {isRejected && (
                <Badge className="bg-red-500/20 text-red-500">
                  Rejected – You can request again
                </Badge>
              )}
            </div>

            {isPending && (
              <p className="text-muted-foreground">
                Your request is being reviewed by admin.
              </p>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground">
            You have not submitted any seller upgrade request yet.
          </p>
        )}

        <Separator />

        {/* ================= ACTION ================= */}
        <Button
          disabled={submitting || isPending || isApproved}
          onClick={handleRequestUpgrade}
          className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black"
        >
          {submitting
            ? "Submitting..."
            : isApproved
            ? "Already a Seller"
            : isPending
            ? "Request Pending"
            : "Request to Become Seller"}
        </Button>
      </div>
    </div>
  );
}

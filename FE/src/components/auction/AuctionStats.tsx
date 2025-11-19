import { Gavel, TrendingUp, Users, Package } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative";
}

function StatCard({ icon, label, value, change, changeType }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-6 hover:border-border transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#fbbf24]/20 to-[#f59e0b]/20">
          {icon}
        </div>
        {change && (
          <div
            className={`flex items-center gap-1 ${
              changeType === "positive" ? "text-[#10b981]" : "text-[#ef4444]"
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>{change}</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-muted-foreground">{label}</p>
        <p className="text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function AuctionStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        icon={<Gavel className="h-6 w-6 text-[#fbbf24]" />}
        label="Active Auctions"
        value="1,234"
        change="+12%"
        changeType="positive"
      />
      <StatCard
        icon={<TrendingUp className="h-6 w-6 text-[#fbbf24]" />}
        label="Total Bids Today"
        value="8,945"
        change="+8%"
        changeType="positive"
      />
      <StatCard
        icon={<Users className="h-6 w-6 text-[#fbbf24]" />}
        label="Active Bidders"
        value="3,567"
        change="+23%"
        changeType="positive"
      />
      <StatCard
        icon={<Package className="h-6 w-6 text-[#fbbf24]" />}
        label="Items Sold"
        value="456"
        change="+5%"
        changeType="positive"
      />
    </div>
  );
}

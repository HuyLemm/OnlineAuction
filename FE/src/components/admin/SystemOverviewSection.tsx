import { ArrowUp, ArrowDown, Users, Package, Gavel, DollarSign, TrendingUp } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: any;
  trend?: "up" | "down";
}

function StatCard({ title, value, change, icon: Icon, trend = "up" }: StatCardProps) {
  const isPositive = trend === "up";
  
  return (
    <Card className="p-6 bg-card border-border/50 hover:border-[#fbbf24]/30 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-[#fbbf24]/10 to-[#f59e0b]/10 border border-[#fbbf24]/20">
          <Icon className="h-6 w-6 text-[#fbbf24]" />
        </div>
        <Badge 
          variant="secondary" 
          className={`${
            isPositive 
              ? "bg-green-500/10 text-green-500" 
              : "bg-red-500/10 text-red-500"
          } border-0`}
        >
          <span className="flex items-center gap-1">
            {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {Math.abs(change)}%
          </span>
        </Badge>
      </div>
      <h3 className="text-foreground mb-1">{value}</h3>
      <p className="text-muted-foreground text-sm">{title}</p>
    </Card>
  );
}

export function SystemOverviewSection() {
  const stats = [
    { title: "Total Users", value: "12,458", change: 12.5, icon: Users, trend: "up" as const },
    { title: "Active Auctions", value: "342", change: 8.2, icon: Gavel, trend: "up" as const },
    { title: "Total Products", value: "1,829", change: 15.3, icon: Package, trend: "up" as const },
    { title: "Revenue (30d)", value: "$248,920", change: 23.1, icon: DollarSign, trend: "up" as const },
  ];

  const recentActivity = [
    { user: "John Doe", action: "Registered as seller", time: "2 minutes ago", status: "pending" },
    { user: "Jane Smith", action: "Listed new auction", time: "15 minutes ago", status: "approved" },
    { user: "Mike Johnson", action: "Completed purchase", time: "32 minutes ago", status: "completed" },
    { user: "Sarah Williams", action: "Requested seller upgrade", time: "1 hour ago", status: "pending" },
    { user: "Tom Brown", action: "Reported product", time: "2 hours ago", status: "review" },
  ];

  const systemMetrics = [
    { label: "Server Health", value: 98, color: "bg-green-500" },
    { label: "Database Performance", value: 94, color: "bg-blue-500" },
    { label: "API Response Time", value: 87, color: "bg-[#fbbf24]" },
    { label: "User Satisfaction", value: 92, color: "bg-green-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-foreground mb-2">System Overview</h1>
        <p className="text-muted-foreground">
          Monitor platform performance and key metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="xl:col-span-2 p-6 bg-card border-border/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-foreground mb-1">Recent Activity</h3>
              <p className="text-muted-foreground text-sm">Latest platform events</p>
            </div>
            <Badge className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black border-0">
              Live
            </Badge>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50 hover:border-[#fbbf24]/30 transition-all"
              >
                <div className="flex-1">
                  <p className="text-foreground mb-1">{activity.user}</p>
                  <p className="text-muted-foreground text-sm">{activity.action}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground text-sm">{activity.time}</span>
                  <Badge 
                    variant="secondary"
                    className={
                      activity.status === "approved" 
                        ? "bg-green-500/10 text-green-500 border-0"
                        : activity.status === "pending"
                        ? "bg-[#f59e0b]/10 text-[#f59e0b] border-0"
                        : activity.status === "review"
                        ? "bg-red-500/10 text-red-500 border-0"
                        : "bg-blue-500/10 text-blue-500 border-0"
                    }
                  >
                    {activity.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* System Metrics */}
        <Card className="p-6 bg-card border-border/50">
          <div className="mb-6">
            <h3 className="text-foreground mb-1">System Health</h3>
            <p className="text-muted-foreground text-sm">Real-time metrics</p>
          </div>

          <div className="space-y-6">
            {systemMetrics.map((metric, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground">{metric.label}</span>
                  <span className="text-sm text-[#fbbf24]">{metric.value}%</span>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-border/50">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-foreground">Performance</p>
                <p className="text-xs text-muted-foreground">Above average</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

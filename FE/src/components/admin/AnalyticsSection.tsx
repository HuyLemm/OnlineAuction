import { Card } from "../ui/card";
import { TrendingUp, TrendingDown, DollarSign, Users, Package, Gavel } from "lucide-react";
import { Badge } from "../ui/badge";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

export function AnalyticsSection() {
  const revenueData = [
    { month: "Jan", revenue: 45000, users: 320 },
    { month: "Feb", revenue: 52000, users: 380 },
    { month: "Mar", revenue: 48000, users: 350 },
    { month: "Apr", revenue: 61000, users: 420 },
    { month: "May", revenue: 55000, users: 390 },
    { month: "Jun", revenue: 67000, users: 450 },
    { month: "Jul", revenue: 72000, users: 480 },
    { month: "Aug", revenue: 68000, users: 460 },
    { month: "Sep", revenue: 75000, users: 510 },
    { month: "Oct", revenue: 82000, users: 550 },
    { month: "Nov", revenue: 89000, users: 600 },
    { month: "Dec", revenue: 95000, users: 640 },
  ];

  const categoryData = [
    { name: "Luxury Watches", value: 35, count: 234 },
    { name: "Fine Art", value: 28, count: 189 },
    { name: "Rare Collectibles", value: 22, count: 156 },
    { name: "Vintage Cars", value: 10, count: 78 },
    { name: "Others", value: 5, count: 112 },
  ];

  const auctionData = [
    { day: "Mon", active: 45, completed: 32, failed: 8 },
    { day: "Tue", active: 52, completed: 38, failed: 5 },
    { day: "Wed", active: 48, completed: 41, failed: 6 },
    { day: "Thu", active: 61, completed: 35, failed: 7 },
    { day: "Fri", active: 55, completed: 48, failed: 4 },
    { day: "Sat", active: 67, completed: 52, failed: 9 },
    { day: "Sun", active: 58, completed: 45, failed: 6 },
  ];

  const COLORS = ["#fbbf24", "#f59e0b", "#d97706", "#b45309", "#92400e"];

  const stats = [
    {
      title: "Total Revenue",
      value: "$892,450",
      change: 23.5,
      trend: "up" as const,
      icon: DollarSign,
      period: "vs last month"
    },
    {
      title: "New Users",
      value: "2,340",
      change: 12.8,
      trend: "up" as const,
      icon: Users,
      period: "this month"
    },
    {
      title: "Active Auctions",
      value: "342",
      change: -5.2,
      trend: "down" as const,
      icon: Gavel,
      period: "vs last week"
    },
    {
      title: "Total Products",
      value: "1,829",
      change: 18.3,
      trend: "up" as const,
      icon: Package,
      period: "all time"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-foreground mb-2">Analytics & Reports</h1>
        <p className="text-muted-foreground">
          Platform performance insights and trends
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === "up";
          
          return (
            <Card key={index} className="p-6 bg-card border-border/50 hover:border-[#fbbf24]/30 transition-all">
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
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(stat.change)}%
                  </span>
                </Badge>
              </div>
              <h3 className="text-foreground mb-1">{stat.value}</h3>
              <p className="text-muted-foreground text-sm">{stat.title}</p>
              <p className="text-muted-foreground text-xs mt-2">{stat.period}</p>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue & User Growth */}
        <Card className="p-6 bg-card border-border/50">
          <div className="mb-6">
            <h3 className="text-foreground mb-1">Revenue & User Growth</h3>
            <p className="text-muted-foreground text-sm">Monthly performance overview</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="month" 
                stroke="rgba(255,255,255,0.5)"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#14141a', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#fbbf24" 
                strokeWidth={2}
                dot={{ fill: '#fbbf24', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Distribution */}
        <Card className="p-6 bg-card border-border/50">
          <div className="mb-6">
            <h3 className="text-foreground mb-1">Category Distribution</h3>
            <p className="text-muted-foreground text-sm">Product breakdown by category</p>
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#14141a', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-2">
            {categoryData.map((cat, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-foreground">{cat.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{cat.count} items</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Auction Activity */}
        <Card className="xl:col-span-2 p-6 bg-card border-border/50">
          <div className="mb-6">
            <h3 className="text-foreground mb-1">Weekly Auction Activity</h3>
            <p className="text-muted-foreground text-sm">Auction status by day</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={auctionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="day" 
                stroke="rgba(255,255,255,0.5)"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#14141a', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="active" fill="#fbbf24" radius={[8, 8, 0, 0]} />
              <Bar dataKey="completed" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="failed" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-card border-border/50">
          <h4 className="text-foreground mb-4">Top Performing Categories</h4>
          <div className="space-y-3">
            {categoryData.slice(0, 3).map((cat, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{cat.name}</span>
                <Badge className="bg-[#fbbf24]/10 text-[#fbbf24] border-0">
                  {cat.value}%
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-card border-border/50">
          <h4 className="text-foreground mb-4">Conversion Rate</h4>
          <div className="text-center">
            <h2 className="text-foreground text-4xl mb-2">78.5%</h2>
            <p className="text-muted-foreground text-sm">Successful auctions</p>
            <Badge className="mt-4 bg-green-500/10 text-green-500 border-0">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5.2% vs last month
            </Badge>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border/50">
          <h4 className="text-foreground mb-4">Average Bid Value</h4>
          <div className="text-center">
            <h2 className="text-foreground text-4xl mb-2">$4,250</h2>
            <p className="text-muted-foreground text-sm">Per auction</p>
            <Badge className="mt-4 bg-green-500/10 text-green-500 border-0">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.3% vs last month
            </Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}

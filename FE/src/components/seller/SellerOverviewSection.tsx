export function SellerOverviewSection() {
  return (
    <div className="space-y-6">
      <h1 className="text-foreground">Seller Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Sales", value: "$156,430", color: "from-[#fbbf24]/20 to-[#f59e0b]/20", iconColor: "text-[#fbbf24]" },
          { label: "Active Listings", value: "3", color: "from-[#10b981]/20 to-[#10b981]/10", iconColor: "text-[#10b981]" },
          { label: "Sold Items", value: "24", color: "from-[#3b82f6]/20 to-[#3b82f6]/10", iconColor: "text-[#3b82f6]" },
          { label: "Avg Rating", value: "4.8", color: "from-[#8b5cf6]/20 to-[#8b5cf6]/10", iconColor: "text-[#8b5cf6]" },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border/50 rounded-xl p-6">
            <p className="text-muted-foreground mb-2">{stat.label}</p>
            <p className="text-foreground text-2xl">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

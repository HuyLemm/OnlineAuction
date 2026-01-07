import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  type NotificationCategory,
  getCategoryConfig,
} from "./NotificationBadge";
import { Check } from "lucide-react";

interface NotificationFiltersProps {
  selectedCategories: NotificationCategory[];
  onCategoryToggle: (category: NotificationCategory) => void;
  onClearAll: () => void;
  notificationCounts?: Partial<Record<NotificationCategory, number>>;
}

const allCategories: NotificationCategory[] = [
  "bid_update",
  "bid_rejection",
  "auction_ending",
  "auction_won",
  "auction_lost",
  "seller_response",
  "order_status",
  "rating",
];

export function NotificationFilters({
  selectedCategories,
  onCategoryToggle,
  onClearAll,
  notificationCounts = {},
}: NotificationFiltersProps) {
  const hasActiveFilters =
    selectedCategories.length > 0 &&
    selectedCategories.length < allCategories.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[#fbbf24]">Filter by Category</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-[#fbbf24] hover:text-[#d4a446] hover:bg-[#fbbf24]/10 h-auto p-0"
          >
            Clear filters
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {allCategories.map((category) => {
          const config = getCategoryConfig(category);
          const Icon = config.icon;
          const isSelected = selectedCategories.includes(category);
          const count = notificationCounts[category] || 0;

          return (
            <Button
              key={category}
              variant="outline"
              size="sm"
              onClick={() => onCategoryToggle(category)}
              className={`${
                isSelected
                  ? `${config.bgColor} ${config.color} border-2 border-current shadow-lg`
                  : "bg-[#1a1a1a] text-gray-300 border-[#fbbf24]/20 hover:border-[#fbbf24]/40 hover:bg-[#1a1a1a]/80"
              }`}
            >
              <Icon className="h-3.5 w-3.5 mr-1.5" />
              {config.label}
              {count > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 px-1.5 bg-[#0a0a0a] text-[#fbbf24] border border-[#fbbf24]/20"
                >
                  {count}
                </Badge>
              )}
              {isSelected && <Check className="h-3.5 w-3.5 ml-1.5" />}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

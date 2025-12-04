import { ArrowUpDown, Clock, DollarSign, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export type SortOption = "ending_soon" | "price_asc" | "price_desc" | "newest" | "oldest";

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string; icon: any }[] = [
  { value: "ending_soon", label: "Ending Soon", icon: Clock },
  { value: "price_asc", label: "Price: Low to High", icon: DollarSign },
  { value: "price_desc", label: "Price: High to Low", icon: DollarSign },
  { value: "newest", label: "Newest First", icon: Calendar },
  { value: "oldest", label: "Oldest First", icon: Calendar },
];

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const currentOption = sortOptions.find((opt) => opt.value === value);
  const Icon = currentOption?.icon || ArrowUpDown;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-[#1a1a1a] border-[#fbbf24]/30 text-white hover:bg-[#1a1a1a]/80 hover:border-[#fbbf24]/50"
        >
          <Icon className="h-4 w-4 mr-2" />
          {currentOption?.label || "Sort By"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-[#1a1a1a] border-[#fbbf24]/20 text-white min-w-[200px]"
      >
        {sortOptions.map((option) => {
          const OptionIcon = option.icon;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`cursor-pointer ${
                value === option.value
                  ? "bg-[#fbbf24]/20 text-[#fbbf24]"
                  : "text-gray-300 hover:bg-[#fbbf24]/10 hover:text-white"
              }`}
            >
              <OptionIcon className="h-4 w-4 mr-2" />
              {option.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

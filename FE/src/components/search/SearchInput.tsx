import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  onSubmit,
  placeholder = "Search auctions...",
  autoFocus = true,
}: SearchInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit(value);
    }
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#fbbf24]" />

      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="h-14 pl-12 pr-12 bg-[#1a1a1a] border-[#fbbf24]/30 text-white placeholder:text-gray-500 focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 rounded-xl transition-all"
      />

      {value && (
        <button
          onClick={onClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

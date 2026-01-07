import { X } from "lucide-react";

interface FilterChipProps {
  label: string;
  value: string;
  onRemove: () => void;
  variant?: "category" | "price" | "default";
}

export function FilterChip({
  label,
  value,
  onRemove,
  variant = "default",
}: FilterChipProps) {
  const variantStyles = {
    category: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    price: "bg-green-500/10 border-green-500/30 text-green-400",
    default: "bg-[#fbbf24]/10 border-[#fbbf24]/30 text-[#fbbf24]",
  };

  return (
    <div
      className={`border-[#fbbf24]/30 bg-[#fbbf24]/10 text-[#fbbf24] px-3 py-1.5 gap-2 text-sm inline-flex items-center rounded-full`}
    >
      <span className="opacity-60">{label}</span>
      <button
        onClick={onRemove}
        className="ml-1 hover:opacity-70 transition-opacity"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-3.5 w-3.5 cursor-pointer" />
      </button>
    </div>
  );
}

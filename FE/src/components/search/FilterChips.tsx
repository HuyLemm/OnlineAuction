import { FilterChip } from "./FilterChip";

export interface ActiveFilter {
  type: "category" | "price" | "default";
  label: string;
  value: string;
  id: string;
}

interface FilterChipsProps {
  filters: ActiveFilter[];
  onRemoveFilter: (id: string) => void;
  onClearAll: () => void;
}

export function FilterChips({ filters, onRemoveFilter, onClearAll }: FilterChipsProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-gray-400">Active Filters:</span>
      {filters.map((filter) => (
        <FilterChip
          key={filter.id}
          label={filter.label}
          value={filter.value}
          variant={filter.type}
          onRemove={() => onRemoveFilter(filter.id)}
        />
      ))}
      {filters.length > 1 && (
        <button
          onClick={onClearAll}
          className="ml-2 text-sm text-gray-400 hover:text-[#fbbf24] underline transition-colors"
        >
          Clear All
        </button>
      )}
    </div>
  );
}

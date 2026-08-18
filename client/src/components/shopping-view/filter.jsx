import { filterOptions } from "@/config";
import { Fragment, useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, X } from "lucide-react";

function formatGroupLabel(key) {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

function ProductFilter({ filters, handleFilter }) {
  const [openSections, setOpenSections] = useState(
    Object.keys(filterOptions).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {})
  );

  function toggleSection(key) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const activeChips = Object.keys(filters || {}).flatMap((groupKey) =>
    (filters[groupKey] || []).map((optionId) => {
      const optionMeta = filterOptions[groupKey]?.find((o) => o.id === optionId);
      return {
        group: groupKey,
        id: optionId,
        label: optionMeta?.label || optionId,
      };
    })
  );

  function clearAllFilters() {
    activeChips.forEach((chip) => handleFilter(chip.group, chip.id));
  }

  return (
    <div className="bg-background rounded-lg shadow-sm sticky top-4 self-start">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        {activeChips.length > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs font-medium text-muted-foreground hover:text-foreground underline underline-offset-2"
          >
            Clear all
          </button>
        )}
      </div>

      {activeChips.length > 0 && (
        <div className="p-4 pb-0 flex flex-wrap gap-2">
          {activeChips.map((chip) => (
            <button
              key={`${chip.group}-${chip.id}`}
              onClick={() => handleFilter(chip.group, chip.id)}
              className="flex items-center gap-1 rounded-full border bg-muted px-3 py-1 text-xs font-medium hover:bg-muted/70 transition-colors"
            >
              {chip.label}
              <X className="h-3 w-3" />
            </button>
          ))}
        </div>
      )}

      <div className="p-4 space-y-1">
        {Object.keys(filterOptions).map((keyItem) => {
          const isOpen = openSections[keyItem];
          const selectedCount = filters?.[keyItem]?.length || 0;

          return (
            <Fragment key={keyItem}>
              <div className="py-2">
                <button
                  onClick={() => toggleSection(keyItem)}
                  className="w-full flex items-center justify-between group"
                >
                  <h3 className="text-sm font-bold tracking-wide uppercase flex items-center gap-2">
                    {formatGroupLabel(keyItem)}
                    {selectedCount > 0 && (
                      <span className="flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-black text-white text-[11px] font-semibold">
                        {selectedCount}
                      </span>
                    )}
                  </h3>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-200 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="grid gap-2.5">
                      {filterOptions[keyItem].map((option) => (
                        <Label
                          key={option.id}
                          className="flex items-center gap-2 font-medium text-sm cursor-pointer hover:text-foreground text-muted-foreground [&:has(button[data-state=checked])]:text-foreground"
                        >
                          <Checkbox
                            checked={Boolean(filters?.[keyItem]?.includes(option.id))}
                            onCheckedChange={() => handleFilter(keyItem, option.id)}
                          />
                          {option.label}
                        </Label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default ProductFilter;
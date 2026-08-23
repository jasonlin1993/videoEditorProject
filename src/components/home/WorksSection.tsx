"use client";

import { useState } from "react";
import { workFilters, works, type FilterId } from "@/lib/mock-data";
import WorkCard from "./WorkCard";

export default function WorksSection() {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");

  const visibleWorks =
    activeFilter === "all"
      ? works
      : works.filter((work) => work.category === activeFilter);

  return (
    <section id="works" className="border-t border-line px-6 py-14 lg:px-13">
      <div className="flex flex-wrap gap-3">
        {workFilters.map((filter) => {
          const isActive = filter.id === activeFilter;

          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              aria-pressed={isActive}
              className={`border px-5 py-2.5 text-sm transition-colors ${
                isActive
                  ? "border-cream text-cream"
                  : "border-line text-muted hover:border-muted hover:text-cream"
              }`}
            >
              {filter.label} {filter.count}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visibleWorks.map((work) => (
          <WorkCard key={work.id} work={work} />
        ))}
      </div>
    </section>
  );
}

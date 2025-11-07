"use client";

interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const FilterTabs = ({ activeFilter, onFilterChange }: FilterTabsProps) => {
  const filters = [
    { id: "all", label: "All Events" },
    { id: "conference", label: "Conferences" },
    { id: "meetup", label: "Meetups" },
    { id: "hackathon", label: "Hackathons" },
    { id: "workshop", label: "Workshops" },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === filter.id
              ? "bg-primary text-black"
              : "bg-dark-200 text-light-200 hover:bg-dark-100 hover:text-light-100"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;

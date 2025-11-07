"use client";

import { useState, useMemo } from "react";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { SearchBar, FilterTabs, SortDropdown } from "@/lib/events";

interface EventsPageClientProps {
  initialEvents: IEvent[];
}

export default function EventsPageClient({
  initialEvents,
}: EventsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Filtrage et tri des événements
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = initialEvents;

    // Filtrage par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query) ||
          event.tags.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }

    // Filtrage par catégorie
    if (activeFilter !== "all") {
      filtered = filtered.filter((event) =>
        event.tags.some((tag: string) =>
          tag.toLowerCase().includes(activeFilter)
        )
      );
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "newest":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

    return filtered;
  }, [initialEvents, searchQuery, activeFilter, sortBy]);

  return (
    <section>
      <h1 className="text-center">Discover All Events</h1>
      <p className="text-center mt-5">
        Explore our complete collection of developer events, conferences, and
        meetups from around the world.
      </p>

      <div className="mt-20 space-y-7">
        {/* Barre de recherche et filtres */}
        <div className="flex flex-col lg:flex-row gap-6">
          <SearchBar onSearch={setSearchQuery} />
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="flex-1">
              <FilterTabs
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />
            </div>
            <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
          </div>
        </div>

        {/* Résultats */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3>
            {searchQuery || activeFilter !== "all"
              ? `Results (${filteredAndSortedEvents.length})`
              : `All Events (${filteredAndSortedEvents.length})`}
          </h3>
          {(searchQuery || activeFilter !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all");
                setSortBy("newest");
              }}
              className="text-primary hover:text-primary/80 text-sm underline"
            >
              Clear filters
            </button>
          )}
        </div>

        <ul className="events">
          {filteredAndSortedEvents.length > 0 ? (
            filteredAndSortedEvents.map((event: IEvent) => (
              <li
                key={event._id?.toString() || event.slug || event.title}
                className="list-none"
              >
                <EventCard {...event} />
              </li>
            ))
          ) : (
            <li className="list-none col-span-full">
              <div className="text-center py-20">
                <p className="text-light-200 text-lg">
                  {searchQuery || activeFilter !== "all"
                    ? "No events match your search criteria."
                    : "No events found."}
                </p>
                <p className="text-light-100 mt-2">
                  {searchQuery || activeFilter !== "all"
                    ? "Try adjusting your search or filters."
                    : "Check back later for new events!"}
                </p>
              </div>
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}

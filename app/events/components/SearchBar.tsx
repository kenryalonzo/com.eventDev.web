"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar = ({
  onSearch,
  placeholder = "Search events...",
}: SearchBarProps) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(query);
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="w-5 h-5 text-light-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 bg-dark-200 border border-dark-100 rounded-lg text-light-100 placeholder-light-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
      />
    </div>
  );
};

export default SearchBar;

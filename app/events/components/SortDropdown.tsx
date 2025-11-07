"use client";

import { useState } from "react";
import Image from "next/image";

interface SortDropdownProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const SortDropdown = ({ sortBy, onSortChange }: SortDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { id: "newest", label: "Newest First" },
    { id: "oldest", label: "Oldest First" },
    { id: "name-asc", label: "Name A-Z" },
    { id: "name-desc", label: "Name Z-A" },
    { id: "date-asc", label: "Date Soonest" },
    { id: "date-desc", label: "Date Latest" },
  ];

  const currentSortLabel =
    sortOptions.find((option) => option.id === sortBy)?.label || "Sort by";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-dark-200 border border-dark-100 rounded-lg text-light-200 hover:bg-dark-100 hover:text-light-100 transition-colors"
      >
        <span>{currentSortLabel}</span>
        <Image
          src="/icons/arrow-down.svg"
          alt="dropdown"
          width={16}
          height={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          {/* Overlay pour fermer le dropdown en cliquant ailleurs */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu déroulant */}
          <div className="absolute right-0 top-full mt-1 w-48 bg-dark-100 border border-dark-200 rounded-lg shadow-lg z-20">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onSortChange(option.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-dark-200 hover:text-light-100 transition-colors ${
                  sortBy === option.id
                    ? "bg-primary text-black font-medium"
                    : "text-light-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SortDropdown;

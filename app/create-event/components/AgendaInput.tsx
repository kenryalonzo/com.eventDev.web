"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

interface AgendaInputProps {
  agenda: string[];
  onAgendaChange: (agenda: string[]) => void;
}

export default function AgendaInput({
  agenda,
  onAgendaChange,
}: AgendaInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addAgendaItem = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      onAgendaChange([...agenda, trimmedValue]);
      setInputValue("");
    }
  };

  const removeAgendaItem = (index: number) => {
    onAgendaChange(agenda.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addAgendaItem();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add agenda item (e.g., Registration & Welcome)"
          className="flex-1 px-3 py-2 bg-dark-200 border border-dark-100 rounded-lg text-light-100 placeholder-light-200 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="button"
          onClick={addAgendaItem}
          disabled={!inputValue.trim()}
          className="px-4 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-black transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {agenda.length > 0 && (
        <div className="space-y-2">
          {agenda.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-dark-200 border border-dark-100 rounded-lg"
            >
              <span className="flex-1 text-light-100">{item}</span>
              <button
                type="button"
                onClick={() => removeAgendaItem(index)}
                className="p-1 hover:bg-dark-100 rounded transition-colors"
              >
                <X size={16} className="text-light-200" />
              </button>
            </div>
          ))}
        </div>
      )}

      {agenda.length === 0 && (
        <p className="text-light-200 text-sm">
          Add at least one agenda item to describe your event schedule
        </p>
      )}
    </div>
  );
}

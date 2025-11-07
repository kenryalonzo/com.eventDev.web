"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/lib/actions/create-event.actions";
import TagsInput from "./TagsInput";
import AgendaInput from "./AgendaInput";
import ImageUpload from "./ImageUpload";

interface EventFormData {
  title: string;
  description: string;
  overview: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: "online" | "offline" | "hybrid";
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  image: File | null;
  imageName?: string; // Pour sauvegarder le nom du fichier
}

const STORAGE_KEY = "create-event-draft";

export default function CreateEventForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    overview: "",
    venue: "",
    location: "",
    date: "",
    time: "",
    mode: "offline",
    audience: "",
    agenda: [],
    organizer: "",
    tags: [],
    image: null,
  });

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Restaurer les données depuis localStorage au montage
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData((prev) => ({
          ...prev,
          ...parsedData,
          image: null, // L'image ne peut pas être restaurée depuis localStorage
        }));
      }
    } catch (error) {
      console.warn("Failed to restore form data from localStorage:", error);
    }
  }, []);

  // Sauvegarder automatiquement dans localStorage
  useEffect(() => {
    try {
      // Créer une copie des données sans l'image (qui ne peut pas être sérialisée)
      const { image, ...dataToSave } = formData;

      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.warn("Failed to save form data to localStorage:", error);
    }
  }, [formData]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validation côté client
    if (formData.tags.length === 0) {
      setError("Please add at least one tag");
      return;
    }

    if (formData.agenda.length === 0) {
      setError("Please add at least one agenda item");
      return;
    }

    if (!formData.image) {
      setError("Please select an event image");
      return;
    }

    // Créer FormData pour l'action serveur
    const submitFormData = new FormData();

    // Ajouter tous les champs texte
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "tags" || key === "agenda") {
        submitFormData.append(key, JSON.stringify(value));
      } else if (key === "image" && value) {
        submitFormData.append(key, value);
      } else if (typeof value === "string") {
        submitFormData.append(key, value);
      }
    });

    // Nettoyer le localStorage avant soumission (si elle réussit, l'utilisateur sera redirigé)
    localStorage.removeItem(STORAGE_KEY);

    startTransition(async () => {
      try {
        const result = await createEvent(submitFormData);

        // Nettoyer définitivement le localStorage après succès
        localStorage.removeItem(STORAGE_KEY);

        // Rediriger vers la page de l'événement créé
        router.push(`/events/${result.slug}`);
      } catch (error) {
        // Remettre les données dans localStorage en cas d'erreur
        const { image, ...dataToSave } = formData;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));

        setError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Event Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-dark-200 border border-dark-100 rounded-lg text-light-100 placeholder-light-200 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter event title"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="organizer" className="text-sm font-medium">
                Organizer *
              </label>
              <input
                type="text"
                id="organizer"
                name="organizer"
                value={formData.organizer}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-dark-200 border border-dark-100 rounded-lg text-light-100 placeholder-light-200 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Your organization name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Short Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 bg-dark-200 border border-dark-100 rounded-lg text-light-100 placeholder-light-200 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Brief description of your event"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="overview" className="text-sm font-medium">
              Detailed Overview *
            </label>
            <textarea
              id="overview"
              name="overview"
              value={formData.overview}
              onChange={handleInputChange}
              required
              rows={5}
              className="w-full px-3 py-2 bg-dark-200 border border-dark-100 rounded-lg text-light-100 placeholder-light-200 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Detailed description of your event, agenda, speakers, etc."
            />
          </div>
        </div>

        {/* Event Details */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Event Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="venue" className="text-sm font-medium">
                Venue *
              </label>
              <input
                type="text"
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-dark-200 border border-dark-100 rounded-lg text-light-100 placeholder-light-200 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Conference center, hotel, etc."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-dark-200 border border-dark-100 rounded-lg text-light-100 placeholder-light-200 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="City, Country"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-dark-200 border border-dark-100 rounded-lg text-light-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="time" className="text-sm font-medium">
                Time *
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-dark-200 border border-dark-100 rounded-lg text-light-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="mode" className="text-sm font-medium">
                Event Mode *
              </label>
              <select
                id="mode"
                name="mode"
                value={formData.mode}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-dark-200 border border-dark-100 rounded-lg text-light-100 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="offline">Offline</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="audience" className="text-sm font-medium">
                Target Audience *
              </label>
              <input
                type="text"
                id="audience"
                name="audience"
                value={formData.audience}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-dark-200 border border-dark-100 rounded-lg text-light-100 placeholder-light-200 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Developers, Designers, etc."
              />
            </div>
          </div>
        </div>

        {/* Content & Media */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Content & Media</h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Event Tags *</label>
              <TagsInput
                tags={formData.tags}
                onTagsChange={(tags) =>
                  setFormData((prev) => ({ ...prev, tags }))
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Event Agenda *</label>
              <AgendaInput
                agenda={formData.agenda}
                onAgendaChange={(agenda) =>
                  setFormData((prev) => ({ ...prev, agenda }))
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Event Image *
                {formData.imageName && !formData.image && (
                  <span className="text-amber-400 text-xs ml-2">
                    (Previously: {formData.imageName} - please reselect)
                  </span>
                )}
              </label>
              <ImageUpload
                onImageChange={(image) =>
                  setFormData((prev) => ({
                    ...prev,
                    image,
                    imageName: image ? image.name : prev.imageName,
                  }))
                }
              />
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Auto-save Indicator */}
        <div className="flex items-center justify-between pt-4 border-t border-dark-200">
          <p className="text-light-200 text-sm">
            💾 Your progress is automatically saved locally
          </p>
          <button
            type="submit"
            disabled={isPending}
            className="px-8 py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-black transition-colors"
          >
            {isPending ? "Creating Event..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}

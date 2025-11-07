"use server";

import { revalidatePath } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function createEvent(formData: FormData) {
  try {
    // Validation côté serveur des champs requis
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const overview = formData.get("overview") as string;
    const venue = formData.get("venue") as string;
    const location = formData.get("location") as string;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const mode = formData.get("mode") as string;
    const audience = formData.get("audience") as string;
    const organizer = formData.get("organizer") as string;
    const tags = JSON.parse(formData.get("tags") as string);
    const agenda = JSON.parse(formData.get("agenda") as string);
    const image = formData.get("image") as File;

    // Validation des champs requis
    if (
      !title ||
      !description ||
      !overview ||
      !venue ||
      !location ||
      !date ||
      !time ||
      !mode ||
      !audience ||
      !organizer ||
      !tags ||
      !agenda ||
      !image
    ) {
      throw new Error("All fields are required");
    }

    if (!Array.isArray(tags) || tags.length === 0) {
      throw new Error("At least one tag is required");
    }

    if (!Array.isArray(agenda) || agenda.length === 0) {
      throw new Error("At least one agenda item is required");
    }

    // Validation du fichier image
    if (!image || !image.type.startsWith("image/")) {
      throw new Error("A valid image file is required");
    }

    if (image.size > 5 * 1024 * 1024) {
      throw new Error("Image file must be less than 5MB");
    }

    // Créer FormData pour l'API
    const apiFormData = new FormData();
    apiFormData.append("title", title);
    apiFormData.append("description", description);
    apiFormData.append("overview", overview);
    apiFormData.append("venue", venue);
    apiFormData.append("location", location);
    apiFormData.append("date", date);
    apiFormData.append("time", time);
    apiFormData.append("mode", mode);
    apiFormData.append("audience", audience);
    apiFormData.append("organizer", organizer);
    apiFormData.append("tags", JSON.stringify(tags));
    apiFormData.append("agenda", JSON.stringify(agenda));
    apiFormData.append("image", image);

    // Appel à l'API
    const response = await fetch(`${BASE_URL}/api/events`, {
      method: "POST",
      body: apiFormData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create event");
    }

    const result = await response.json();

    // Revalider les chemins pour mettre à jour le cache
    revalidatePath("/");
    revalidatePath("/events");

    // Retourner le résultat avec le slug pour redirection côté client
    return {
      success: true,
      event: result.event,
      slug: result.event.slug,
    };
  } catch (error) {
    console.error("Error creating event:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while creating the event"
    );
  }
}

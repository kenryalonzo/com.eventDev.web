"use server";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Fonction serveur pour récupérer les données des événements pour la page Events
export async function getEventsData() {
  // Pendant le build, retourner des données mockées pour éviter les erreurs
  if (
    process.env.NODE_ENV === "production" &&
    !process.env.NEXT_PUBLIC_VERCEL_ENV
  ) {
    return [];
  }

  try {
    const response = await fetch(`${BASE_URL}/api/events`);
    const { events } = await response.json();
    return events || [];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

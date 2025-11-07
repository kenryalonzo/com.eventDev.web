"use server";

import { cacheLife } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Fonction serveur pour récupérer les données des événements pour la page Events
export async function getEventsData() {
  "use cache";
  cacheLife("hours");
  try {
    const response = await fetch(`${BASE_URL}/api/events`);
    const { events } = await response.json();
    return events || [];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

import { getEventsData } from "@/lib/actions/events-page.actions";
import EventsPageClient from "./EventsPageClient";

// Page principale (Server Component)
export default async function EventsPage() {
  const initialEvents = await getEventsData();

  return <EventsPageClient initialEvents={initialEvents} />;
}

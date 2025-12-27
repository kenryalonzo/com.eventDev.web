
import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // client-side
  if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`; // Vercel (toujours défini sur Vercel)
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // fallback Vercel
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL; // fallback local/dev
  return "http://localhost:3000"; // local dev
};

const Page = async () => {
  // Pendant le build, retourner des données mockées pour éviter les erreurs
  let events: IEvent[] = [];
  if (
    process.env.NODE_ENV === "production" &&
    !process.env.NEXT_PUBLIC_VERCEL_ENV
  ) {
    events = [];
  } else {
    try {
  const response = await fetch(`${getBaseUrl()}/api/events`, { next: { revalidate: 60 } });
      const { events: fetchedEvents } = await response.json();
      events = fetchedEvents || [];
    } catch (error) {
      console.error("Error fetching events:", error);
      events = [];
    }
  }

  return (
    <section>
      <h1 className="text-center">
        The Hub for Every Dev <br /> Event You Can't Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events">
          {events &&
            events.length > 0 &&
            events.map((event: IEvent) => (
              <li key={event.title} className="list-none">
                <EventCard {...event} />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default Page;

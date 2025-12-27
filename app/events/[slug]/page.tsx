export const dynamic = "force-dynamic";
import { Suspense } from "react";
import EventDetails from "@/components/EventDetails";
import { notFound } from "next/navigation";


const EventDetailsPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  // Pendant le build, ne pas rendre la page pour éviter les erreurs d'API
  if (
    process.env.NODE_ENV === "production" &&
    !process.env.NEXT_PUBLIC_VERCEL_ENV
  ) {
    return notFound();
  }

  return (
    <main>
      <EventDetails params={slug} />
    </main>
  );
};

export default EventDetailsPage;

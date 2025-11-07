import CreateEventForm from "./components/CreateEventForm";

export default function CreateEventPage() {
  return (
    <section>
      <h1 className="text-center">Create New Event</h1>
      <p className="text-center mt-5">
        Share your event with the developer community and reach thousands of
        attendees.
      </p>

      <div className="mt-20">
        <CreateEventForm />
      </div>
    </section>
  );
}

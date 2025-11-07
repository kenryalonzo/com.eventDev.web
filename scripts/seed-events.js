const mongoose = require("mongoose");
require("dotenv").config();

// Définir le schéma Event directement dans le script
const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true, lowercase: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    mode: {
      type: String,
      required: true,
      enum: ["online", "offline", "hybrid"],
    },
    audience: { type: String, required: true, trim: true },
    agenda: { type: [String], required: true },
    organizer: { type: String, required: true, trim: true },
    tags: { type: [String], required: true },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook pour générer le slug
EventSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  if (this.isModified("date")) {
    try {
      const parsedDate = new Date(this.date);
      if (!isNaN(parsedDate.getTime())) {
        this.date = parsedDate.toISOString().split("T")[0];
      }
    } catch (error) {
      return next(new Error("Date must be a valid date string"));
    }
  }

  if (this.isModified("time")) {
    this.time = this.time.trim();
    if (!this.time) {
      return next(new Error("Time cannot be empty"));
    }
  }

  next();
});

const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);

const events = [
  {
    slug: "react-conf-2024",
    image: "/images/event1.png",
    title: "React Conf 2024",
    location: "San Francisco, CA",
    date: "2024-03-15",
    time: "9:00 AM - 6:00 PM",
  },
  {
    slug: "nextjs-summit",
    image: "/images/event2.png",
    title: "Next.js Summit",
    location: "Austin, TX",
    date: "2024-04-22",
    time: "10:00 AM - 5:00 PM",
  },
  {
    slug: "javascript-world",
    image: "/images/event3.png",
    title: "JavaScript World Conference",
    location: "New York, NY",
    date: "2024-05-08",
    time: "8:30 AM - 7:00 PM",
  },
  {
    slug: "ai-hackathon-2024",
    image: "/images/event4.png",
    title: "AI Innovation Hackathon",
    location: "Seattle, WA",
    date: "2024-06-14",
    time: "48 Hours",
  },
  {
    slug: "web3-developer-meetup",
    image: "/images/event5.png",
    title: "Web3 Developer Meetup",
    location: "Miami, FL",
    date: "2024-07-20",
    time: "6:00 PM - 9:00 PM",
  },
  {
    slug: "fullstack-conference",
    image: "/images/event6.png",
    title: "Full Stack Conference",
    location: "Denver, CO",
    date: "2024-08-12",
    time: "9:00 AM - 6:00 PM",
  },
];

// Transformer les données pour correspondre au modèle Event
const transformedEvents = events.map((event) => ({
  title: event.title,
  slug: event.slug,
  description: `Join us for ${event.title}, an exciting event for developers featuring talks, workshops, and networking opportunities.`,
  overview: `This premier ${event.title} brings together developers from around the world to share knowledge, learn new technologies, and connect with the community.`,
  image: event.image,
  venue: event.location.split(",")[0].trim(),
  location: event.location,
  date: event.date,
  time: event.time,
  mode: "offline",
  audience: "Developers, Engineers, Tech Enthusiasts",
  agenda: [
    "Registration & Welcome",
    "Keynote Presentation",
    "Technical Sessions",
    "Networking Break",
    "Workshops & Hands-on Labs",
    "Closing Ceremony",
  ],
  organizer: "DevEvents Team",
  tags: ["technology", "development", "conference", "networking"],
}));

async function seedEvents() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");

    // Supprimer les événements existants
    await mongoose.connection.db.dropCollection("events").catch(() => {
      console.log("Collection events does not exist, skipping drop");
    });

    // Insérer les nouveaux événements
    const createdEvents = await Event.insertMany(transformedEvents);
    console.log(`Created ${createdEvents.length} events successfully`);

    // Fermer la connexion
    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding events:", error);
    process.exit(1);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  seedEvents();
}

module.exports = { seedEvents, transformedEvents };

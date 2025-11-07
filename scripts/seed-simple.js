const mongoose = require("mongoose");
require("dotenv").config();

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected successfully!");

    // Define Event schema
    const eventSchema = new mongoose.Schema(
      {
        title: String,
        slug: String,
        description: String,
        overview: String,
        image: String,
        venue: String,
        location: String,
        date: String,
        time: String,
        mode: String,
        audience: String,
        agenda: [String],
        organizer: String,
        tags: [String],
      },
      { timestamps: true }
    );

    const Event = mongoose.model("Event", eventSchema);

    // Clear existing events
    await Event.deleteMany({});
    console.log("Cleared existing events");

    // Sample events data (avec slugs corrects générés automatiquement)
    const events = [
      {
        title: "React Conf 2024",
        slug: "react-conf-2024", // Slug généré automatiquement
        description:
          "Join us for React Conf 2024, an exciting event for developers featuring talks, workshops, and networking opportunities.",
        overview:
          "This premier React Conf 2024 brings together developers from around the world to share knowledge, learn new technologies, and connect with the community.",
        image: "/images/event1.png",
        venue: "San Francisco",
        location: "San Francisco, CA",
        date: "2024-03-15",
        time: "9:00 AM - 6:00 PM",
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
      },
      {
        title: "Next.js Summit",
        slug: "next-js-summit", // Slug généré automatiquement
        description:
          "Join us for Next.js Summit, an exciting event for developers featuring talks, workshops, and networking opportunities.",
        overview:
          "This premier Next.js Summit brings together developers from around the world to share knowledge, learn new technologies, and connect with the community.",
        image: "/images/event2.png",
        venue: "Austin",
        location: "Austin, TX",
        date: "2024-04-22",
        time: "10:00 AM - 5:00 PM",
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
      },
      {
        title: "JavaScript World Conference",
        slug: "javascript-world-conference", // Slug généré automatiquement
        description:
          "Join us for JavaScript World Conference, an exciting event for developers featuring talks, workshops, and networking opportunities.",
        overview:
          "This premier JavaScript World Conference brings together developers from around the world to share knowledge, learn new technologies, and connect with the community.",
        image: "/images/event3.png",
        venue: "New York",
        location: "New York, NY",
        date: "2024-05-08",
        time: "8:30 AM - 7:00 PM",
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
      },
    ];

    // Insert events
    const insertedEvents = await Event.insertMany(events);
    console.log(`Successfully inserted ${insertedEvents.length} events!`);

    // Close connection
    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();

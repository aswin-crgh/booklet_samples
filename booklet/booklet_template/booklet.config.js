export const bookletConfig = {
  id: "sample-booklet",
  title: "Sample Booklet",
  cover: {
    kicker: "interactive science booklet",
    title: "SAMPLE",
    line: "A configurable notebook shell for a science topic.",
  },
  theme: {
    accent: "#173a92",
    secondary: "#4c8f5d",
    highlight: "#f4dc72",
  },
  pages: {
    immersive: {
      label: "01 Explore",
      title: "Explore the Model",
      ftue: "Rotate, zoom, tap a part, and read related notes.",
      status: "loading model...",
    },
    gallery: {
      enabled: true,
      label: "02 Gallery",
      title: "Look Closely",
      eyebrow: "observation guide",
      ftue: "Use the arrows to compare views.",
      body: "Use this page for microscope views, diagrams, field photos, or any topic-specific image gallery.",
      guideTitle: "Tags To Notice",
      guideBody: "Tags help students connect visual evidence with the notes.",
      slides: [],
    },
    video: {
      enabled: true,
      label: "03 Watch",
      title: "Watch",
      ftue: "Pick a video from the playlist to begin watching.",
      videos: [],
    },
    flashcards: {
      title: "Flash Card Desk",
      cards: [["What belongs here?", "Topic-specific revision cards."]],
    },
    quiz: {
      title: "Timed Quiz",
      seconds: 300,
      help: "Answer from memory first. Then return to earlier pages to repair weak spots.",
      cards: [],
    },
    extras: {
      title: "People Behind The Ideas",
      subtitle: "Global and Indian contributors connected to this topic.",
      people: [],
    },
  },
  model: {
    assetBase: "./models",
    manifest: null,
    parts: [],
    camera: {
      position: [0, 0, 5.8],
      target: [0, 0, 0],
      normalizedSize: 3.1,
      rotation: [-0.12, 0.2, 0],
    },
    selectedPartId: null,
    primaryPartIds: [],
  },
  notes: {
    overview: {
      title: "What are we exploring?",
      body: "This overview is generated from booklet.config.js.",
      primary: [],
      secondary: [],
    },
    partDetails: {},
  },
};

export interface Astronaut {
  id: string;
  name: string;
  role: string;
  agency: "NASA" | "CSA";
  country: string;
  bio: string;
  funFact: string;
  extendedBio: string[];
  imageUrl: string;
}

export interface FlightPhase {
  id: string;
  phaseNumber: number;
  title: string;
  duration: string;
  altitudeRange: string;
  description: string;
  keyAction: string;
}

export interface SpacecraftPart {
  id: string;
  name: string;
  description: string;
  specifications: { label: string; value: string }[];
  highlight: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: Date;
  error?: boolean;
}

import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK lazily to prevent crash if key is missing upon initial container start
let genAI: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please add it via Settings > Secrets in AI Studio.");
    }
    genAI = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAI;
}

// System instruction to guide the Gemini model on Artemis II facts
const ARTEMIS_SYSTEM_INSTRUCTION = `
You are Artemis Flight, an expert conversational space historian and NASA flight controller specializing in the Artemis space program, specifically the Artemis II (Artemis 2) mission. 

Your objective is to provide extremely accurate, educational, clear, and engaging responses to questions about the Artemis II mission. 

Key Artemis II Facts to reinforce:
- Mission Overview: Artemis II is the first crewed lunar flyby flight test of the Space Launch System (SLS) rocket and Orion spacecraft.
- Crew Members:
  1. Commander: Reid Wiseman (NASA, USA) - Flight experienced, commanded Expedition 41.
  2. Pilot: Victor Glover (NASA, USA) - Flew on SpaceX Crew-1, first Black astronaut on a lunar mission.
  3. Mission Specialist 1: Christina Koch (NASA, USA) - Held record for longest single spaceflight by a woman, flight experienced.
  4. Mission Specialist 2: Jeremy Hansen (CSA, Canada) - Canadian Space Agency astronaut, first non-American on a lunar mission.
- Spacecraft & Launch Vehicle: 
  - Rocket: Space Launch System (SLS) Block 1 configuration, generating 8.8 million pounds of thrust.
  - Spacecraft: Orion Spacecraft + European Service Module (ESM) built by Airbus (providing power, water, propulsion).
- Mission Trajectory & Timeline:
  - Estimated launch: Late 2025 / 2026.
  - Duration: Approx. 10-day flight test.
  - Orbit profile: Initial high Earth orbit (HEO) for 24-hour system checks, followed by hybrid-free-return trajectory using lunar gravity flyby (approximately 7,400 km past the lunar far side) to return to Earth.
  - Landing: Splashdown in the Pacific Ocean off the coast of California.
- Primary Objectives:
  - Validate life support, communication, navigation, radiation shielding, and crew operations in deep space.
  - Final qualification test before landing humans on the moon on Artemis III.

Rules for your responses:
1. Always be supportive, inspiring, and professional. 
2. If asked about facts outside of space exploration, gently guide the user back to Artemis or lunar missions.
3. Keep responses concise and highly legible. Use markdown formatting (bullet points, bold text) where appropriate.
`;

// API endpoint for Artemis Q&A
app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message is required." });
      return;
    }

    const ai = getGenAI();

    // Map client-side chat history to the correct SDK input format if provided.
    // Each history item is: { role: "user" | "model", text: string }
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((item: any) => {
        contents.push({
          role: item.role === "user" ? "user" : "model",
          parts: [{ text: item.text }],
        });
      });
    }

    // Add the current user query to the payload
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: ARTEMIS_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I was unable to formulate a response. Please try again.";
    res.json({ reply });
  } catch (err: any) {
    console.error("Gemini API Error in /api/chat:", err);
    res.status(500).json({ 
      error: err.message || "An unexpected error occurred while communicating with the lunar database." 
    });
  }
});

// Configure Vite or Static files depending on environment
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    // For local development, load Vite Dev Server
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Serve index.html for any remaining route (SPA fallback)
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Artemis II Mission Portal server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((error) => {
  console.error("Error starting server:", error);
});

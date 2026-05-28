import { GoogleGenAI } from "@google/genai";

// Initialize GoogleGenAI SDK lazily to prevent crash if key is missing
let genAI: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please add it via environmental variables inside Vercel Dashboard.");
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

// Default serverless function handler for Vercel
export default async function handler(req: any, res: any) {
  // Handle CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const ai = getGenAI();

    // Map client-side chat history to the correct SDK input format if provided.
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
    return res.status(200).json({ reply });
  } catch (err: any) {
    console.error("Gemini API Error in serverless handler:", err);
    return res.status(500).json({ 
      error: err.message || "An unexpected error occurred while communicating with the lunar database." 
    });
  }
}

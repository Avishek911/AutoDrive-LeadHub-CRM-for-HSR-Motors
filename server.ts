import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI lazily / cleanly on server
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Route: AI Lead Insights & Communication Generator
app.post("/api/ai/lead-assistant", async (req, res) => {
  try {
    const { lead, taskType, customPrompt } = req.body;
    const ai = getGenAI();

    if (!ai) {
      // Fallback structured response if key not available
      return res.json({
        success: true,
        text: `[AI Lead Suggestion for ${lead?.name || 'Customer'}]\n- Preferred Vehicle: ${lead?.interestedModel || 'Car Model'}\n- Budget: ${lead?.budget || 'N/A'}\n- Recommended Action: Follow up regarding financing options and offer a weekend home test drive.\n- Suggested Script: "Hi ${lead?.name || 'there'}, this is from HSR Motors! I noticed you were interested in the ${lead?.interestedModel || 'vehicle'}. We have a exclusive test-drive slot available this Saturday!"`
      });
    }

    let prompt = "";
    if (taskType === "call_script") {
      prompt = `You are an expert sales trainer for HSR Motors, a premier car dealership in Bangalore. 
Generate a 45-second high-conversion phone call script for a sales rep reaching out to lead:
Customer Name: ${lead.name}
Phone: ${lead.phone}
Channel Source: ${lead.source}
Interested Vehicle: ${lead.interestedModel}
Budget Range: ${lead.budget}
Current Status: ${lead.status}
Notes/Context: ${lead.notes || 'Interested in test drive'}

Keep it polite, professional, value-driven, and focused on booking a showroom or home test drive.`;
    } else if (taskType === "whatsapp") {
      prompt = `Generate an engaging, personalized WhatsApp follow-up message with emojis for HSR Motors car dealership:
Customer: ${lead.name}
Vehicle: ${lead.interestedModel}
Budget: ${lead.budget}
Source: ${lead.source}

Include clear CTA for scheduling a test drive or downloading the brochure. Keep under 120 words.`;
    } else if (taskType === "executive_summary") {
      prompt = `Provide a concise 3-bullet AI Lead Risk & Priority Assessment for HSR Motors management regarding lead:
Name: ${lead.name} | Status: ${lead.status} | Source: ${lead.source} | Lead Score: ${lead.score} | Budget: ${lead.budget}.
Highlight conversion probability, key deal blocker, and recommended next action.`;
    } else {
      prompt = customPrompt || `Provide tailored sales guidance for lead ${lead?.name} interested in ${lead?.interestedModel}.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    return res.json({
      success: true,
      text: response.text || "Generated recommendations successfully.",
    });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to generate AI insights",
    });
  }
});

// API Route: AI Proposal Generator for Product Management Assignment
app.post("/api/ai/generate-assignment-doc", async (req, res) => {
  try {
    const { userName, collegeId, appName } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        success: true,
        overview: "HSR Motors experiences lead leakage and delayed response times due to manual spreadsheet tracking across fragmented channels (Facebook, Google, Twitter, Website). AutoDrive LeadHub replaces spreadsheets with a real-time collaborative lead management suite tailored for Sales Reps and Business Managers.",
        features: [
          "1. Multi-Channel Lead Aggregation: Centralized real-time inbox for Facebook, Google, Twitter, Website, and Walk-in leads with instant SLA timers.",
          "2. 360° Lead Details & Test Drive Scheduling: Comprehensive profile including budget, preferred models, trade-in details, interaction logs, and instant booking.",
          "3. Dynamic Lead Kanban & SLA Breach Engine: Visual status pipeline with automated SLA countdown timers, auto-assignment rules, and redistribution.",
          "4. Business Analytics & Source Attribution Dashboard: Real-time graphs tracking channel ROI, conversion funnels, sales rep leaderboards, and model interest.",
          "5. Gemini AI Sales Copilot: Auto-generates personalized call scripts, WhatsApp proposals, and lead risk assessments."
        ],
        userFlow: "1. Lead Ingestion -> Auto-routed based on budget/source rules -> Sales Rep notified within 2 mins -> Rep reviews 360 details & triggers AI call script -> Test drive scheduled -> Status updated on Kanban -> Manager monitors conversion funnel on Dashboard."
      });
    }

    const prompt = `As a Lead Product Manager preparing an assignment submission for DeltaX for the company "HSR Motors" (Car Dealership):
User Name: ${userName || 'Avishek Rajput'}
Application Name: ${appName || 'AutoDrive LeadHub CRM'}

Write detailed, professional content for the assignment submission following these sections:
1. OVERVIEW: Deep problem understanding (spreadsheet pain points, lack of real-time collaboration, lead decay) and strategic product approach.
2. KEY FEATURES: List 5 key innovative features with descriptions and business use-cases.
3. USER FLOW: Step-by-step walk-through of the end-to-end journey for both Sales Reps and Business Managers.

Return the response in structured JSON format with fields: "overview", "features" (array of strings), and "userFlow".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      success: true,
      ...parsed,
    });
  } catch (err: any) {
    console.error("Error generating assignment doc:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HSR Motors LeadHub server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

import { GoogleGenAI } from "@google/genai"

export async function getGeminiSummaryService({ chartConfig, dataSample }) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set in environment")

  const ai = new GoogleGenAI({ apiKey })

  const prompt = `You are a data analyst. Given the following chart configuration and data sample, provide a concise, insightful summary for a user dashboard.\n\nChart config: ${JSON.stringify(chartConfig, null, 2)}\nData sample: ${JSON.stringify(dataSample, null, 2)}\n\nSummary:`

  // Use the Gemini API as per the new usage
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  })

  // The response.text contains the summary
  return response.text || "No summary returned."
} 
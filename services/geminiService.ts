import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeInfrastructureError = async (errorLog: string): Promise<string> => {
  try {
    const client = getClient();
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an SRE at a global payments company. Analyze this infrastructure error and output EXACTLY in this format:
ROOT CAUSE: [1 sentence]
FIX: [concrete command or config change]
PREVENTION: [brief best practice]

Error Log:
${errorLog}`,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Speed over deep reasoning for simple error logs
      }
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze error log. Please check your API key and network connection.");
  }
};
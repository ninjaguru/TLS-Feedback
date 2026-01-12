
import { GoogleGenAI } from "@google/genai";
import { SurveyData } from "../types";

export const generateThankYouMessage = async (data: SurveyData): Promise<string> => {
  // Use VITE_ prefix for environment variables in the browser
  const apiKey = (import.meta.env.VITE_API_KEY as string) || "";

  if (!apiKey || apiKey === "YOUR_API_KEY") {
    console.warn("Gemini API key not found. Using default thank you message.");
    return "Thank you for sharing your experience with us. We value your feedback and look forward to welcoming you back soon.";
  }

  // Follow the original API structure provided in the codebase
  // @ts-ignore - Using the internal/custom library pattern as originally defined
  const ai = new GoogleGenAI({ apiKey });

  const stylistNames = data.stylistRatings.map(s => s.name).join(", ");
  const ratings = data.stylistRatings.map(s => `${s.name}: ${s.rating}/5`).join(", ");

  const prompt = `
    Context: A client just finished a service at "The London Salon". 
    Aesthetics: Elegant, professional, warm, quiet luxury.
    Feedback Data:
    - Stylists: ${stylistNames}
    - Ratings: ${ratings}
    - First visit: ${data.isFirstVisit ? 'Yes' : 'No'}
    - Satisfied: ${data.isSatisfied ? 'Yes' : 'No'}
    - Environment check: ${data.isWelcoming ? 'Excellent' : 'Needs improvement'}
    - Timeliness: ${data.isTimely ? 'Good' : 'Could be better'}
    - Tea service: ${data.teaOffered ? 'Provided' : 'Missed'}
    - Packages explained: ${data.packagesExplained ? 'Yes' : 'No'}
    - Comments: "${data.additionalComments}"

    Task: Write a personalized, warm, and professional thank-you message from the management.
    Requirements:
    - Under 60 words.
    - Reference specific feedback (e.g., mention the stylist, the tea, or their satisfaction level).
    - If there was a concern (e.g., not satisfied, environment poor), acknowledge it gracefully and offer a follow-up.
    - If everything was perfect, celebrate their visit.
    - tone: Quiet Luxury (sophisticated and minimalist).
  `;

  try {
    // Reverting to the original models.generateContent pattern
    // @ts-ignore
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text?.trim() || "Thank you for sharing your experience with us. We value your feedback and look forward to welcoming you back soon.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Thank you for your valuable feedback. It helps us maintain our standard of excellence.";
  }
};

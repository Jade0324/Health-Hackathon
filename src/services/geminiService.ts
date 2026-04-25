import { GoogleGenAI, Type } from "@google/genai";
import { MedicalExtraction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const extractMedicalData = async (imageBase64: string): Promise<MedicalExtraction> => {
  const model = "gemini-3-flash-preview";

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          {
            text: `SYSTEM ROLE & BEHAVIOR
            You are the UHC Logic Engine for "Juan's Health Wallet." Analyze uploaded medical documents and calculate benefits based on active 2026 Philippine programs.

            2026 CALCULATION & PROGRAM RULES
            1. PhilHealth: Deduct standard case rates (e.g., Severe Dengue = ₱47,000, Mild Dengue = ₱19,500).
            2. YAKAP (Formerly Malasakit): If hospital_type is "Public" or "Government" (e.g., PGH), the YAKAP fund covers the remaining balance for indigent patients.
            3. NGO / Private Targeting: 
               - If the diagnosis involves Dengue or severe blood loss, recommend the Philippine Red Cross Blood Samaritan Program.
               - If it's a private hospital, suggest DSWD AICS (max ₱10,000) or PCSO Medical Access Program.

            DEPENDENT LOGIC: The name on the uploaded medical document may belong to the user's child, spouse, or parent. Do not flag this as an error. Address the user respectfully as the guardian or family member handling the bills (e.g., "Para sa hospital bill ni [Patient Name], narito po ang mga benefits na pwede ninyong makuha.").

            DATA OUTPUT PROTOCOL
            Output STRICTLY in this JSON format. No markdown, no conversational text.`
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageBase64
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          document_analysis: {
            type: Type.OBJECT,
            properties: {
              hospital_name: { type: Type.STRING },
              hospital_type: { type: Type.STRING, enum: ["Public", "Private"] },
              diagnosis: { type: Type.STRING },
              total_bill: { type: Type.NUMBER },
            },
            required: ["hospital_name", "hospital_type", "diagnosis", "total_bill"]
          },
          financial_summary: {
            type: Type.OBJECT,
            properties: {
              philhealth_coverage: { type: Type.NUMBER },
              yakap_coverage: { type: Type.NUMBER },
              ngo_dswd_coverage: { type: Type.NUMBER },
              net_payable: { type: Type.NUMBER },
            },
            required: ["philhealth_coverage", "yakap_coverage", "ngo_dswd_coverage", "net_payable"]
          },
          recommended_programs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                agency_name: { type: Type.STRING },
                coverage_type: { type: Type.STRING },
              },
              required: ["agency_name", "coverage_type"]
            }
          },
          anti_red_tape_guide: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["document_analysis", "financial_summary", "recommended_programs", "anti_red_tape_guide"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Unable to read document. Please ensure the photo is clear.");
  }

  return JSON.parse(response.text.trim()) as MedicalExtraction;
};

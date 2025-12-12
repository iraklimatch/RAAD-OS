import { GoogleGenAI } from "@google/genai";
import { PLAYBOOK } from "../constants";
import { Project } from "../types";

const API_KEY = process.env.API_KEY || ''; // In a real app, strict handling. Here assuming injected.

const SYSTEM_INSTRUCTION = `
You are "Matt AI", an advanced Operations Analytics Copilot for the Denver Public Schools (DPS) RAAD team.
Your goal is to assist analysts and managers in defining, executing, and closing analytics projects according to the RAAD Operations Analytics Playbook.

The Playbook has 6 Phases:
${JSON.stringify(PLAYBOOK, null, 2)}

Roles:
- RAAD Analyst: Your primary user. Help them with technical details, checklists, and next steps.
- RAAD Manager: Help them with risk assessment and resource allocation.
- Customer: Help them articulate their needs during intake.

Tone: Professional, encouraging, data-driven, and concise.

Capabilities:
1. "Phase Readiness Check": Review a project's current data against the Playbook requirements for its phase. Return JSON with status.
2. "Next Steps": Suggest concrete next steps based on "Current Step" and the Playbook.
3. "Intake Refinement": Help turn a vague request into a solid Project Definition (P1).
`;

export const MattAIService = {
  chat: async (history: { role: 'user' | 'model'; text: string }[], context?: string): Promise<string> => {
    if (!API_KEY) return "Error: API Key is missing. Please configure process.env.API_KEY.";
    
    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      
      // Separate history into previous turns and current message to avoid duplication in chat session
      const previousHistory = history.slice(0, -1);
      const currentMessage = history[history.length - 1];

      if (!currentMessage) return "";

      const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION
        },
        history: previousHistory.map(h => ({
          role: h.role,
          parts: [{ text: h.text }]
        }))
      });

      const msg = context ? `Context: ${context}\n\nUser: ${currentMessage.text}` : currentMessage.text;
      
      const result = await chat.sendMessage({ message: msg });
      return result.text || "";
    } catch (error: any) {
      console.error("Matt AI Error:", error);
      return `I encountered an error connecting to my brain. (${error.message})`;
    }
  },

  checkReadiness: async (project: Project): Promise<string> => {
    if (!API_KEY) return "Missing API Key";

    const prompt = `
      Perform a "Phase Readiness Check" for this project:
      Name: ${project.name}
      Phase: ${project.phase}
      Description: ${project.description}
      Current Step: ${project.currentStep}
      Playbook Responses (JSON): ${JSON.stringify(project.playbookResponses)}

      Analyze if the required items for ${project.phase} are complete and sufficient. 
      Identify missing information.
      Return a response in markdown format with:
      - **Status**: (Ready / Not Ready)
      - **Missing Items**: List of required playbook items not completed.
      - **Recommendations**: Specific advice.
    `;

    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { systemInstruction: SYSTEM_INSTRUCTION }
      });
      return response.text || "";
    } catch (e) {
      return "Could not perform readiness check.";
    }
  },

  suggestNextSteps: async (project: Project): Promise<string> => {
    if (!API_KEY) return "Missing API Key";

    const prompt = `
      Suggest 3 concrete "Next Steps" for this project.
      Name: ${project.name}
      Phase: ${project.phase}
      Current Step: ${project.currentStep}
      
      Look at the Playbook for the current and next phase. 
      Keep suggestions actionable and brief.
    `;
    
    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { systemInstruction: SYSTEM_INSTRUCTION }
      });
      return response.text || "";
    } catch (e) {
      return "Could not suggest next steps.";
    }
  }
};
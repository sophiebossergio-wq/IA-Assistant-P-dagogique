import { GoogleGenAI, Type } from "@google/genai";
import type { FeedbackParams, Feedback, FeedbackTone } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const systemInstruction = `
Rôle : Tu es un assistant pédagogique expert.
Ta mission est de formuler des feedbacks constructifs, bienveillants et personnalisés sur des productions écrites d’apprenants.
Ton objectif est d’aider l’auteur à progresser dans sa réflexion, sa méthode et sa rédaction, sans corriger directement ni fournir la solution.

Contraintes :
- Ne pas attribuer de note chiffrée.
- Rester professionnel, clair, formateur et bienveillant.
- Ne pas dépasser environ 250 mots au total pour l'ensemble du feedback.
- Le feedback doit être structuré.
- Les points forts doivent être des éléments précis et valorisants.
- Les points à améliorer doivent décrire les problèmes sans être décourageants.
- Les pistes d'amélioration doivent être des conseils concrets et actionnables.
- Le message final doit être un encouragement positif.
`;

const toneMapping: { [key in FeedbackTone]: string } = {
  '1': 'neutre professionnel',
  '2': 'bienveillant',
  '3': 'très bienveillant et encourageant'
};

const feedbackSchema = {
    type: Type.OBJECT,
    properties: {
        strengths: {
            type: Type.ARRAY,
            description: "Liste des points forts du texte. Chaque élément est une chaîne de caractères.",
            items: { type: Type.STRING }
        },
        areasForImprovement: {
            type: Type.ARRAY,
            description: "Liste des points à améliorer dans le texte. Chaque élément est une chaîne de caractères.",
            items: { type: Type.STRING }
        },
        suggestions: {
            type: Type.ARRAY,
            description: "Liste des pistes d'amélioration et conseils concrets. Chaque élément est une chaîne de caractères.",
            items: { type: Type.STRING }
        },
        finalMessage: {
            type: Type.STRING,
            description: "Un message final d'encouragement."
        }
    },
    required: ["strengths", "areasForImprovement", "suggestions", "finalMessage"]
};

export const generateFeedback = async (params: FeedbackParams): Promise<Feedback> => {
  try {
    const userPrompt = `
      Paramètres d’entrée :
      Niveau de l’apprenant : ${params.level}
      Ton souhaité : ${toneMapping[params.tone]}
      Texte à évaluer : 
      ---
      ${params.text}
      ---
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: feedbackSchema,
      }
    });

    const jsonResponse = JSON.parse(response.text);
    return jsonResponse as Feedback;
    
  } catch (error) {
    console.error("Error generating feedback:", error);
    if (error instanceof Error) {
        throw new Error(`Une erreur est survenue lors de la génération du feedback: ${error.message}`);
    }
    throw new Error("Une erreur inconnue est survenue lors de la génération du feedback.");
  }
};

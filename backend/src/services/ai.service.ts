import { openai } from '../lib/openai';
import { AIAnalysisResult } from '../types';

const ANALYSIS_PROMPT = `You are a world-class fashion expert, stylist, and AI analyst. Analyze this outfit photo and provide a comprehensive, honest, and detailed assessment.

Respond ONLY with a valid JSON object (no markdown, no code blocks) with this exact structure:

{
  "scoreOverall": <number 1-10, one decimal>,
  "scoreColors": <number 1-10, one decimal>,
  "scoreFit": <number 1-10, one decimal>,
  "scoreAesthetics": <number 1-10, one decimal>,
  "scoreOriginality": <number 1-10, one decimal>,
  "attractivenessScore": <number 0-100, integer, perceived attractiveness boost from outfit>,
  "vibe": <string: one of "Casual Chic", "Streetwear", "Business Casual", "Formal Elegance", "Bohemian", "Athleisure", "Y2K Revival", "Dark Academia", "Cottagecore", "Minimalist", "Maximalist", "Techwear", "Vintage", "Preppy", "E-Girl/E-Boy", "Old Money", "Coastal Grandmother", "Dopamine Dressing", "Quiet Luxury", "Gorpcore", "other">,
  "style": <string: brief style category>,
  "description": <string: 2-3 sentences natural, conversational description of the outfit as a whole>,
  "whatWorks": <array of 3-5 specific strings about what's working well>,
  "whatDoesntWork": <array of 2-4 specific strings about what could be improved>,
  "improvements": <array of 3-5 actionable specific improvement tips>,
  "colorPalette": <array of 3-6 hex color codes that complement this outfit>,
  "accessorySuggestions": <array of 3-5 specific accessory suggestions>,
  "hairstyleSuggestions": <array of 2-4 hairstyle suggestions that would complement this outfit>,
  "socialTips": <array of 2-3 tips on how this outfit works for social situations, dating, events>,
  "roast": <string: a witty, playful, non-mean roast of the outfit — like a funny friend would say>,
  "firstImpression": <string: what someone would think in the first 3 seconds of seeing this outfit>,
  "confidenceBoost": <string: an encouraging, motivational message about this outfit>
}

Be specific, honest but kind, and use contemporary fashion language. Reference actual garments visible in the image.`;

const ROAST_PROMPT = `You are a savage but loveable fashion roaster. Analyze this outfit and ROAST it hard but keep it playful and funny, not mean-spirited. Think Gordon Ramsay meets fashion critic.

Still provide the full analysis JSON but make the roast extra spicy and the description brutally honest (but still constructive).

Respond ONLY with valid JSON using the same structure as above.`;

export async function analyzeOutfit(
  imageUrl: string,
  roastMode: boolean = false
): Promise<AIAnalysisResult> {
  const prompt = roastMode ? ROAST_PROMPT : ANALYSIS_PROMPT;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt,
          },
          {
            type: 'image_url',
            image_url: {
              url: imageUrl,
              detail: 'high',
            },
          },
        ],
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from AI');

  let parsed: AIAnalysisResult;
  try {
    const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('Failed to parse AI response');
  }

  return {
    scoreOverall: clamp(parsed.scoreOverall, 1, 10),
    scoreColors: clamp(parsed.scoreColors, 1, 10),
    scoreFit: clamp(parsed.scoreFit, 1, 10),
    scoreAesthetics: clamp(parsed.scoreAesthetics, 1, 10),
    scoreOriginality: clamp(parsed.scoreOriginality, 1, 10),
    attractivenessScore: clamp(parsed.attractivenessScore, 0, 100),
    vibe: parsed.vibe || 'Casual',
    style: parsed.style || 'Mixed',
    description: parsed.description || '',
    whatWorks: ensureArray(parsed.whatWorks),
    whatDoesntWork: ensureArray(parsed.whatDoesntWork),
    improvements: ensureArray(parsed.improvements),
    colorPalette: ensureArray(parsed.colorPalette),
    accessorySuggestions: ensureArray(parsed.accessorySuggestions),
    hairstyleSuggestions: ensureArray(parsed.hairstyleSuggestions),
    socialTips: ensureArray(parsed.socialTips),
    roast: parsed.roast || '',
    firstImpression: parsed.firstImpression || '',
    confidenceBoost: parsed.confidenceBoost || '',
  };
}

function clamp(value: number, min: number, max: number): number {
  if (typeof value !== 'number' || isNaN(value)) return (min + max) / 2;
  return Math.min(Math.max(value, min), max);
}

function ensureArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v) => typeof v === 'string');
  return [];
}

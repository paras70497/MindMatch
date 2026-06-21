import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || 'missing_key_fallback',
  defaultHeaders: {
    'HTTP-Referer': 'https://mindmatch.app',
    'X-Title': 'MindMatch Compatibility App',
  },
});

export interface AIInsights {
  biggestSimilarity: string;
  biggestDifference: string;
  communicationInsight: string;
  funFact: string;
  summary: string;
}

interface GameSummary {
  player1Nickname: string;
  player2Nickname: string;
  overallScore: number;
  categoryScores: {
    values: number;
    lifestyle: number;
    communication: number;
    personality: number;
    fun: number;
  };
  matchingAnswers: number;
  differentAnswers: number;
  predictionAccuracy: number;
  topMatchingQuestions: string[];
  topDifferentQuestions: string[];
  badges: string[];
}

export async function generateAIInsights(summary: GameSummary): Promise<AIInsights> {
  const prompt = `You are a fun, positive, and insightful compatibility analyst for MindMatch — a real-time compatibility game.

Analyze this compatibility result and generate a personalized report.

Game Summary:
- Players: ${summary.player1Nickname} & ${summary.player2Nickname}
- Overall Compatibility: ${summary.overallScore}%
- Values Match: ${summary.categoryScores.values}%
- Lifestyle Match: ${summary.categoryScores.lifestyle}%
- Communication Match: ${summary.categoryScores.communication}%
- Personality Match: ${summary.categoryScores.personality}%
- Fun Match: ${summary.categoryScores.fun}%
- Matching Answers: ${summary.matchingAnswers}
- Different Answers: ${summary.differentAnswers}
- Prediction Accuracy: ${summary.predictionAccuracy}%
- Earned Badges: ${summary.badges.join(', ')}
- Topics they agreed on: ${summary.topMatchingQuestions.slice(0, 3).join('; ')}
- Topics they differed on: ${summary.topDifferentQuestions.slice(0, 3).join('; ')}

Generate a JSON response with exactly these fields:
{
  "biggestSimilarity": "1-2 sentences about their strongest connection point. Be specific and warm.",
  "biggestDifference": "1-2 sentences about their main difference. Frame it positively as complementary.",
  "communicationInsight": "1-2 sentences about their communication dynamic. Include how they can use it.",
  "funFact": "1 surprising or delightful observation about their compatibility pattern.",
  "summary": "3-4 sentences. A holistic, personalized summary of their dynamic. Keep it positive, playful, and encouraging. Never claim psychological accuracy."
}

Tone: Warm, playful, encouraging. Never clinical or negative. Always frame differences as strengths.
IMPORTANT: Respond ONLY with valid JSON. No markdown, no explanation.`;

  try {
    const response = await client.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 800,
    });

    const content = response.choices[0]?.message?.content || '';
    
    // Parse the JSON response
    const parsed = JSON.parse(content.trim());
    
    return {
      biggestSimilarity: parsed.biggestSimilarity || 'You share a deep alignment in your core values.',
      biggestDifference: parsed.biggestDifference || 'Your approaches to spontaneity bring a lovely balance.',
      communicationInsight: parsed.communicationInsight || 'You communicate with honesty and directness.',
      funFact: parsed.funFact || 'Your combined energy creates something truly unique!',
      summary: parsed.summary || `${summary.player1Nickname} and ${summary.player2Nickname} share a remarkable ${summary.overallScore}% compatibility. Your connection is built on genuine understanding and mutual respect.`,
    };
  } catch (error) {
    console.error('AI insights generation failed:', error);
    
    // Fallback insights
    return generateFallbackInsights(summary);
  }
}

function generateFallbackInsights(summary: GameSummary): AIInsights {
  const strongestCategory = Object.entries(summary.categoryScores).reduce((a, b) =>
    b[1] > a[1] ? b : a
  );
  const weakestCategory = Object.entries(summary.categoryScores).reduce((a, b) =>
    b[1] < a[1] ? b : a
  );

  const categoryNames: Record<string, string> = {
    values: 'core values',
    lifestyle: 'lifestyle choices',
    communication: 'communication style',
    personality: 'personality traits',
    fun: 'sense of fun',
  };

  return {
    biggestSimilarity: `Your strongest connection is your shared ${categoryNames[strongestCategory[0]] || 'perspective'} — you're aligned ${strongestCategory[1]}% in this area, which is a powerful foundation.`,
    biggestDifference: `Your biggest difference lies in ${categoryNames[weakestCategory[0]] || 'certain areas'} (${weakestCategory[1]}%), but this contrast can create beautiful balance when embraced.`,
    communicationInsight: summary.categoryScores.communication >= 70
      ? 'You communicate with remarkable clarity and openness — a rare and precious quality in any relationship.'
      : 'Your different communication styles offer an opportunity to learn from each other and grow together.',
    funFact: summary.predictionAccuracy >= 70
      ? `You predicted each other's answers ${summary.predictionAccuracy}% of the time — you practically read each other's minds!`
      : `With ${summary.matchingAnswers} matching answers, you've found ${summary.matchingAnswers} beautiful common grounds to build on.`,
    summary: `${summary.player1Nickname} and ${summary.player2Nickname} share a ${summary.overallScore}% compatibility score. Your connection is a fascinating blend of harmony and contrast. The areas where you align beautifully serve as anchors, while your differences create the kind of dynamic, interesting energy that makes every conversation worth having. This is just the beginning of understanding each other!`,
  };
}

import { IAnswer } from '@/models/Answer';

interface CategoryScore {
  total: number;
  matched: number;
}

const CATEGORY_WEIGHTS: Record<string, number> = {
  values: 0.40,
  lifestyle: 0.20,
  communication: 0.15,
  personality: 0.15,
  fun: 0.10,
};

/**
 * Compares two answers to determine if they match.
 * For scale questions, considers within-1 a partial match.
 */
function compareAnswers(a1: string | number, a2: string | number): number {
  if (a1 === a2) return 1.0;
  
  // For numeric/scale answers, partial credit for close answers
  const n1 = Number(a1);
  const n2 = Number(a2);
  if (!isNaN(n1) && !isNaN(n2)) {
    const diff = Math.abs(n1 - n2);
    if (diff <= 1) return 0.5;
    return 0;
  }
  
  return 0;
}

export interface ScoringResult {
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
  answerComparisons: Array<{
    questionId: string;
    questionText: string;
    category: string;
    player1Answer: string | number;
    player2Answer: string | number;
    player1Prediction: string | number | null;
    player2Prediction: string | number | null;
    matched: boolean;
    player1PredictionCorrect: boolean;
    player2PredictionCorrect: boolean;
  }>;
}

export function computeScore(
  player1Answers: IAnswer[],
  player2Answers: IAnswer[],
  questionTexts: Record<string, string>
): ScoringResult {
  const categoryScores: Record<string, CategoryScore> = {
    values: { total: 0, matched: 0 },
    lifestyle: { total: 0, matched: 0 },
    communication: { total: 0, matched: 0 },
    personality: { total: 0, matched: 0 },
    fun: { total: 0, matched: 0 },
  };

  const answerComparisons = [];
  let totalPredictions = 0;
  let correctPredictions = 0;

  // Build a map of player2 answers by questionId
  const p2Map = new Map<string, IAnswer>();
  for (const a of player2Answers) {
    p2Map.set(a.questionId, a);
  }

  for (const p1Answer of player1Answers) {
    const p2Answer = p2Map.get(p1Answer.questionId);
    if (!p2Answer) continue;

    const category = p1Answer.category || 'fun';
    if (!categoryScores[category]) categoryScores[category] = { total: 0, matched: 0 };

    const matchScore = compareAnswers(p1Answer.answer, p2Answer.answer);
    categoryScores[category].total += 1;
    categoryScores[category].matched += matchScore;

    // Prediction accuracy
    let p1PredictionCorrect = false;
    let p2PredictionCorrect = false;

    if (p1Answer.prediction !== null && p1Answer.prediction !== undefined) {
      totalPredictions++;
      if (compareAnswers(p1Answer.prediction, p2Answer.answer) === 1.0) {
        correctPredictions++;
        p1PredictionCorrect = true;
      }
    }
    if (p2Answer.prediction !== null && p2Answer.prediction !== undefined) {
      totalPredictions++;
      if (compareAnswers(p2Answer.prediction, p1Answer.answer) === 1.0) {
        correctPredictions++;
        p2PredictionCorrect = true;
      }
    }

    answerComparisons.push({
      questionId: p1Answer.questionId,
      questionText: questionTexts[p1Answer.questionId] || '',
      category,
      player1Answer: p1Answer.answer,
      player2Answer: p2Answer.answer,
      player1Prediction: p1Answer.prediction ?? null,
      player2Prediction: p2Answer.prediction ?? null,
      matched: matchScore >= 0.5,
      player1PredictionCorrect: p1PredictionCorrect,
      player2PredictionCorrect: p2PredictionCorrect,
    });
  }

  // Compute per-category percentages
  const computedCategoryScores = {
    values: 0,
    lifestyle: 0,
    communication: 0,
    personality: 0,
    fun: 0,
  };

  for (const [cat, score] of Object.entries(categoryScores)) {
    if (score.total > 0) {
      const pct = Math.round((score.matched / score.total) * 100);
      computedCategoryScores[cat as keyof typeof computedCategoryScores] = pct;
    }
  }

  // Weighted overall score
  let weightedSum = 0;
  let weightSum = 0;
  for (const [cat, weight] of Object.entries(CATEGORY_WEIGHTS)) {
    const score = computedCategoryScores[cat as keyof typeof computedCategoryScores];
    if (categoryScores[cat]?.total > 0) {
      weightedSum += score * weight;
      weightSum += weight;
    }
  }

  const overallScore = weightSum > 0 ? Math.round(weightedSum / weightSum) : 0;
  const matchingAnswers = answerComparisons.filter(a => a.matched).length;
  const differentAnswers = answerComparisons.filter(a => !a.matched).length;
  const predictionAccuracy = totalPredictions > 0
    ? Math.round((correctPredictions / totalPredictions) * 100)
    : 0;

  return {
    overallScore,
    categoryScores: computedCategoryScores,
    matchingAnswers,
    differentAnswers,
    predictionAccuracy,
    answerComparisons,
  };
}

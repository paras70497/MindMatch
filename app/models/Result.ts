import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategoryScores {
  values: number;
  lifestyle: number;
  communication: number;
  personality: number;
  fun: number;
}

export interface IAIInsights {
  biggestSimilarity: string;
  biggestDifference: string;
  communicationInsight: string;
  funFact: string;
  summary: string;
}

export interface IAnswerComparison {
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
}

export interface IResult extends Document {
  roomId: string;
  player1: { userId: string; nickname: string };
  player2: { userId: string; nickname: string };
  overallScore: number;
  categoryScores: ICategoryScores;
  badges: string[];
  aiInsights: IAIInsights;
  answerComparisons: IAnswerComparison[];
  matchingAnswers: number;
  differentAnswers: number;
  predictionAccuracy: number;
  createdAt: Date;
}

const ResultSchema = new Schema<IResult>({
  roomId: { type: String, required: true, unique: true },
  player1: {
    userId: { type: String, required: true },
    nickname: { type: String, required: true },
  },
  player2: {
    userId: { type: String, required: true },
    nickname: { type: String, required: true },
  },
  overallScore: { type: Number, required: true },
  categoryScores: {
    values: { type: Number, default: 0 },
    lifestyle: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    personality: { type: Number, default: 0 },
    fun: { type: Number, default: 0 },
  },
  badges: [{ type: String }],
  aiInsights: {
    biggestSimilarity: { type: String, default: '' },
    biggestDifference: { type: String, default: '' },
    communicationInsight: { type: String, default: '' },
    funFact: { type: String, default: '' },
    summary: { type: String, default: '' },
  },
  answerComparisons: [
    {
      questionId: String,
      questionText: String,
      category: String,
      player1Answer: Schema.Types.Mixed,
      player2Answer: Schema.Types.Mixed,
      player1Prediction: Schema.Types.Mixed,
      player2Prediction: Schema.Types.Mixed,
      matched: Boolean,
      player1PredictionCorrect: Boolean,
      player2PredictionCorrect: Boolean,
    },
  ],
  matchingAnswers: { type: Number, default: 0 },
  differentAnswers: { type: Number, default: 0 },
  predictionAccuracy: { type: Number, default: 0 },
}, { timestamps: true });

const Result: Model<IResult> =
  mongoose.models.Result || mongoose.model<IResult>('Result', ResultSchema);

export default Result;

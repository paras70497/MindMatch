import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnswer extends Document {
  roomId: string;
  userId: string;
  nickname: string;
  questionId: string;
  questionIndex: number;
  answer: string | number;
  prediction: string | number | null;
  category: string;
  timestamp: Date;
}

const AnswerSchema = new Schema<IAnswer>({
  roomId: { type: String, required: true, index: true },
  userId: { type: String, required: true },
  nickname: { type: String, required: true },
  questionId: { type: String, required: true },
  questionIndex: { type: Number, required: true },
  answer: { type: Schema.Types.Mixed, required: true },
  prediction: { type: Schema.Types.Mixed, default: null },
  category: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Answer: Model<IAnswer> =
  mongoose.models.Answer || mongoose.model<IAnswer>('Answer', AnswerSchema);

export default Answer;

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuestion extends Document {
  text: string;
  category: 'values' | 'lifestyle' | 'communication' | 'personality' | 'fun';
  type: 'multiple_choice' | 'either_or' | 'scale' | 'single_choice';
  options: Array<{ text: string; value: string | number }>;
  isPrediction: boolean;
  weight: number;
  tags: string[];
  isActive: boolean;
}

const QuestionSchema = new Schema<IQuestion>({
  text: { type: String, required: true },
  category: {
    type: String,
    enum: ['values', 'lifestyle', 'communication', 'personality', 'fun'],
    required: true,
  },
  type: {
    type: String,
    enum: ['multiple_choice', 'either_or', 'scale', 'single_choice'],
    required: true,
  },
  options: [
    {
      text: { type: String, required: true },
      value: { type: Schema.Types.Mixed, required: true },
    },
  ],
  isPrediction: { type: Boolean, default: false },
  weight: { type: Number, default: 1 },
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Question: Model<IQuestion> =
  mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question;

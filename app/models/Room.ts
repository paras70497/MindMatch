import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPlayer {
  userId: string;
  nickname: string;
  socketId: string;
  ready: boolean;
  joinedAt: Date;
}

export interface IRoomConfig {
  numQuestions: number;
  categories: string[];
  predictionMode: boolean;
  timerEnabled: boolean;
  timerSeconds: number;
}

export interface IRoom extends Document {
  code: string;
  hostId: string;
  config: IRoomConfig;
  status: 'waiting' | 'playing' | 'finished';
  players: IPlayer[];
  questionIds: string[];
  currentQuestionIndex: number;
  answeredCount: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

const PlayerSchema = new Schema<IPlayer>({
  userId: { type: String, required: true },
  nickname: { type: String, required: true },
  socketId: { type: String, default: '' },
  ready: { type: Boolean, default: false },
  joinedAt: { type: Date, default: Date.now },
});

const RoomSchema = new Schema<IRoom>({
  code: { type: String, required: true, unique: true, uppercase: true, length: 6 },
  hostId: { type: String, required: true },
  config: {
    numQuestions: { type: Number, default: 10 },
    categories: [{ type: String }],
    predictionMode: { type: Boolean, default: false },
    timerEnabled: { type: Boolean, default: false },
    timerSeconds: { type: Number, default: 30 },
  },
  status: {
    type: String,
    enum: ['waiting', 'playing', 'finished'],
    default: 'waiting',
  },
  players: [PlayerSchema],
  questionIds: [{ type: String }],
  currentQuestionIndex: { type: Number, default: 0 },
  answeredCount: { type: Map, of: Number, default: {} },
}, { timestamps: true });

const Room: Model<IRoom> =
  mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);

export default Room;

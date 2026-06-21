import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mindmatch';

const QuestionSchema = new mongoose.Schema({
  text: String,
  category: String,
  type: String,
  options: [{ text: String, value: mongoose.Schema.Types.Mixed }],
  isPrediction: { type: Boolean, default: false },
  weight: { type: Number, default: 1 },
  tags: [String],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

const questions = [
  // ─── VALUES (40%) ───────────────────────────────────────
  {
    text: "You suddenly get ₹10,000. What do you do?",
    category: "values",
    type: "multiple_choice",
    options: [
      { text: "Save it immediately", value: "save" },
      { text: "Invest it smartly", value: "invest" },
      { text: "Spend it on experiences", value: "experience" },
      { text: "Buy something I've wanted", value: "buy" },
    ],
    isPrediction: true,
  },
  {
    text: "What matters most to you in life?",
    category: "values",
    type: "multiple_choice",
    options: [
      { text: "Family and relationships", value: "family" },
      { text: "Career and achievement", value: "career" },
      { text: "Personal freedom", value: "freedom" },
      { text: "Making a difference", value: "impact" },
    ],
    isPrediction: true,
  },
  {
    text: "How important is honesty, even when it hurts?",
    category: "values",
    type: "scale",
    options: [1,2,3,4,5].map(n => ({ text: String(n), value: n })),
    isPrediction: false,
  },
  {
    text: "If you could change one thing about the world, what would it be?",
    category: "values",
    type: "multiple_choice",
    options: [
      { text: "End poverty and inequality", value: "poverty" },
      { text: "Fix climate change", value: "climate" },
      { text: "Promote peace and unity", value: "peace" },
      { text: "Advance science and medicine", value: "science" },
    ],
  },
  {
    text: "What defines a successful life to you?",
    category: "values",
    type: "multiple_choice",
    options: [
      { text: "Wealth and financial security", value: "wealth" },
      { text: "Meaningful relationships", value: "relationships" },
      { text: "Personal growth and learning", value: "growth" },
      { text: "Leaving a legacy", value: "legacy" },
    ],
    isPrediction: true,
  },
  {
    text: "When you see someone struggling, your first instinct is to...",
    category: "values",
    type: "multiple_choice",
    options: [
      { text: "Immediately offer help", value: "help" },
      { text: "Ask if they want assistance", value: "ask" },
      { text: "Give them space to figure it out", value: "space" },
      { text: "Connect them to someone who can help", value: "connect" },
    ],
  },
  {
    text: "How do you feel about mixing money and friendships?",
    category: "values",
    type: "either_or",
    options: [
      { text: "Never mix money and friends", value: "never" },
      { text: "It depends on the amount and situation", value: "sometimes" },
    ],
    isPrediction: true,
  },
  {
    text: "Which principle guides your decisions most?",
    category: "values",
    type: "multiple_choice",
    options: [
      { text: "Do what makes you happy", value: "happiness" },
      { text: "Do what's right, not what's easy", value: "integrity" },
      { text: "Think of others first", value: "altruism" },
      { text: "Logic and reason above all", value: "logic" },
    ],
  },
  {
    text: "How do you feel about ambition?",
    category: "values",
    type: "scale",
    options: [1,2,3,4,5].map(n => ({ text: String(n), value: n })),
    isPrediction: true,
  },
  {
    text: "Do you believe people can truly change?",
    category: "values",
    type: "either_or",
    options: [
      { text: "Yes, people can fundamentally change", value: "yes" },
      { text: "People's core nature stays the same", value: "no" },
    ],
    isPrediction: true,
  },
  {
    text: "What's your relationship with religion or spirituality?",
    category: "values",
    type: "multiple_choice",
    options: [
      { text: "Deeply religious/spiritual", value: "deep" },
      { text: "Somewhat spiritual but open-minded", value: "some" },
      { text: "Prefer science and logic", value: "science" },
      { text: "Haven't really thought about it", value: "none" },
    ],
  },
  {
    text: "Which would you choose: a job you love that pays little, or one you dislike that pays well?",
    category: "values",
    type: "either_or",
    options: [
      { text: "Love the job, less money", value: "love" },
      { text: "Good pay, endure the work", value: "money" },
    ],
    isPrediction: true,
  },

  // ─── LIFESTYLE (20%) ────────────────────────────────────
  {
    text: "How do you prefer to spend a Sunday morning?",
    category: "lifestyle",
    type: "multiple_choice",
    options: [
      { text: "Slow coffee & a book", value: "cozy" },
      { text: "Out for a long hike or walk", value: "active" },
      { text: "Sleeping in until noon", value: "sleep" },
      { text: "Planning the week ahead", value: "plan" },
    ],
    isPrediction: true,
  },
  {
    text: "What does your ideal home look like?",
    category: "lifestyle",
    type: "multiple_choice",
    options: [
      { text: "Cozy apartment in the city", value: "city" },
      { text: "House in the suburbs", value: "suburbs" },
      { text: "Countryside or nature retreat", value: "nature" },
      { text: "Minimalist space, anywhere", value: "minimalist" },
    ],
  },
  {
    text: "Are you a morning person or night owl?",
    category: "lifestyle",
    type: "either_or",
    options: [
      { text: "Morning person 🌅", value: "morning" },
      { text: "Night owl 🦉", value: "night" },
    ],
    isPrediction: true,
  },
  {
    text: "How often do you exercise?",
    category: "lifestyle",
    type: "multiple_choice",
    options: [
      { text: "Every day — it's non-negotiable", value: "daily" },
      { text: "3-4 times a week", value: "regular" },
      { text: "When I feel like it", value: "sometimes" },
      { text: "Rarely — not my thing", value: "rarely" },
    ],
  },
  {
    text: "Your ideal vacation is...",
    category: "lifestyle",
    type: "multiple_choice",
    options: [
      { text: "Beach and relaxation", value: "beach" },
      { text: "Adventure and exploration", value: "adventure" },
      { text: "City and culture", value: "city" },
      { text: "A staycation at home", value: "home" },
    ],
    isPrediction: true,
  },
  {
    text: "How do you feel about keeping things tidy?",
    category: "lifestyle",
    type: "scale",
    options: [1,2,3,4,5].map(n => ({ text: String(n), value: n })),
    isPrediction: true,
  },
  {
    text: "How important is food and dining to you?",
    category: "lifestyle",
    type: "multiple_choice",
    options: [
      { text: "It's a passion — I love exploring cuisines", value: "passion" },
      { text: "I enjoy good food but it's not central", value: "enjoy" },
      { text: "Food is fuel, I keep it simple", value: "simple" },
      { text: "I'm a home cook who loves cooking", value: "cook" },
    ],
  },
  {
    text: "How do you prefer to travel?",
    category: "lifestyle",
    type: "multiple_choice",
    options: [
      { text: "Fully planned itinerary", value: "planned" },
      { text: "Loose plan, figure it out as we go", value: "loose" },
      { text: "Pure spontaneity, no plans", value: "spontaneous" },
      { text: "I prefer familiar places I know", value: "familiar" },
    ],
    isPrediction: true,
  },
  {
    text: "How do you feel about pets?",
    category: "lifestyle",
    type: "multiple_choice",
    options: [
      { text: "Love them — I have or want one", value: "love" },
      { text: "Like them but don't want to own one", value: "like" },
      { text: "Indifferent", value: "neutral" },
      { text: "Not really my thing", value: "dislike" },
    ],
  },
  {
    text: "What's your spending style?",
    category: "lifestyle",
    type: "multiple_choice",
    options: [
      { text: "Saver — I build my financial future", value: "saver" },
      { text: "Balanced — spend and save equally", value: "balanced" },
      { text: "Live in the moment spender", value: "spender" },
      { text: "Investor — money should grow", value: "investor" },
    ],
    isPrediction: true,
  },

  // ─── COMMUNICATION (15%) ────────────────────────────────
  {
    text: "When there's conflict, you tend to...",
    category: "communication",
    type: "multiple_choice",
    options: [
      { text: "Address it immediately and directly", value: "direct" },
      { text: "Take time to cool down first", value: "cooldown" },
      { text: "Try to compromise quickly", value: "compromise" },
      { text: "Avoid conflict as much as possible", value: "avoid" },
    ],
    isPrediction: true,
  },
  {
    text: "How do you prefer to receive feedback?",
    category: "communication",
    type: "multiple_choice",
    options: [
      { text: "Bluntly and directly", value: "direct" },
      { text: "Constructively with examples", value: "constructive" },
      { text: "Gently, with encouragement", value: "gentle" },
      { text: "In writing, so I can process it", value: "written" },
    ],
    isPrediction: true,
  },
  {
    text: "How often do you need alone time to recharge?",
    category: "communication",
    type: "scale",
    options: [1,2,3,4,5].map(n => ({ text: String(n), value: n })),
    isPrediction: true,
  },
  {
    text: "How do you express affection most naturally?",
    category: "communication",
    type: "multiple_choice",
    options: [
      { text: "Words of affirmation", value: "words" },
      { text: "Quality time together", value: "time" },
      { text: "Acts of service", value: "service" },
      { text: "Physical touch", value: "touch" },
    ],
    isPrediction: true,
  },
  {
    text: "When making a big decision, you...",
    category: "communication",
    type: "multiple_choice",
    options: [
      { text: "Trust your gut instinct", value: "gut" },
      { text: "Research extensively first", value: "research" },
      { text: "Consult people you trust", value: "consult" },
      { text: "Make pros and cons lists", value: "list" },
    ],
    isPrediction: true,
  },
  {
    text: "How do you handle being wrong?",
    category: "communication",
    type: "multiple_choice",
    options: [
      { text: "Admit it immediately", value: "admit" },
      { text: "Need time to come around", value: "time" },
      { text: "It depends on the situation", value: "depends" },
      { text: "Struggle with it honestly", value: "struggle" },
    ],
  },
  {
    text: "Do you prefer to talk through problems or solve them alone?",
    category: "communication",
    type: "either_or",
    options: [
      { text: "Talk it through with someone", value: "talk" },
      { text: "Work it out on my own first", value: "alone" },
    ],
    isPrediction: true,
  },
  {
    text: "How important is it to you that people keep their word?",
    category: "communication",
    type: "scale",
    options: [1,2,3,4,5].map(n => ({ text: String(n), value: n })),
  },

  // ─── PERSONALITY (15%) ──────────────────────────────────
  {
    text: "At a party, you're most likely to be...",
    category: "personality",
    type: "multiple_choice",
    options: [
      { text: "Meeting everyone, loving every minute", value: "social" },
      { text: "Having deep conversations with a few people", value: "deep" },
      { text: "Sticking close to the people I came with", value: "close" },
      { text: "Counting down to when I can leave", value: "leave" },
    ],
    isPrediction: true,
  },
  {
    text: "Which describes you best?",
    category: "personality",
    type: "either_or",
    options: [
      { text: "Planner — I love structure and certainty", value: "planner" },
      { text: "Spontaneous — I thrive in the unknown", value: "spontaneous" },
    ],
    isPrediction: true,
  },
  {
    text: "How do you handle stress?",
    category: "personality",
    type: "multiple_choice",
    options: [
      { text: "Exercise and physical activity", value: "exercise" },
      { text: "Talk to someone I trust", value: "talk" },
      { text: "Retreat inward — movies, books, music", value: "retreat" },
      { text: "Stay busy and productive", value: "busy" },
    ],
    isPrediction: true,
  },
  {
    text: "How competitive are you?",
    category: "personality",
    type: "scale",
    options: [1,2,3,4,5].map(n => ({ text: String(n), value: n })),
    isPrediction: true,
  },
  {
    text: "What's your relationship with risk?",
    category: "personality",
    type: "multiple_choice",
    options: [
      { text: "I actively seek out challenges", value: "seeker" },
      { text: "I'll take calculated risks", value: "calculated" },
      { text: "I prefer the safe and proven path", value: "safe" },
      { text: "It depends heavily on the stakes", value: "depends" },
    ],
  },
  {
    text: "When something goes wrong, your first reaction is...",
    category: "personality",
    type: "multiple_choice",
    options: [
      { text: "Stay calm and find solutions", value: "calm" },
      { text: "Feel the emotions first, then act", value: "feel" },
      { text: "Look for what I can learn from it", value: "learn" },
      { text: "Talk to someone to process it", value: "talk" },
    ],
    isPrediction: true,
  },
  {
    text: "How important is being liked by others?",
    category: "personality",
    type: "scale",
    options: [1,2,3,4,5].map(n => ({ text: String(n), value: n })),
    isPrediction: true,
  },
  {
    text: "How do you feel about change?",
    category: "personality",
    type: "either_or",
    options: [
      { text: "I welcome and embrace change", value: "embrace" },
      { text: "I prefer stability and routine", value: "stability" },
    ],
    isPrediction: true,
  },

  // ─── FUN (10%) ──────────────────────────────────────────
  {
    text: "Your ideal weekend activity is...",
    category: "fun",
    type: "multiple_choice",
    options: [
      { text: "Trying something completely new", value: "new" },
      { text: "A cozy movie marathon at home", value: "cozy" },
      { text: "Going out with a big group", value: "social" },
      { text: "A day trip somewhere nearby", value: "trip" },
    ],
    isPrediction: true,
  },
  {
    text: "Which superpower would you choose?",
    category: "fun",
    type: "multiple_choice",
    options: [
      { text: "Read minds", value: "telepathy" },
      { text: "Time travel", value: "time" },
      { text: "Be invisible", value: "invisible" },
      { text: "Fly", value: "fly" },
    ],
    isPrediction: true,
  },
  {
    text: "Your go-to comfort food when you need a pick-me-up?",
    category: "fun",
    type: "multiple_choice",
    options: [
      { text: "Something sweet — chocolate or desserts", value: "sweet" },
      { text: "Salty snacks — chips and crisps", value: "salty" },
      { text: "A big warm meal", value: "meal" },
      { text: "I don't really turn to food for comfort", value: "none" },
    ],
  },
  {
    text: "How spontaneous are you really?",
    category: "fun",
    type: "scale",
    options: [1,2,3,4,5].map(n => ({ text: String(n), value: n })),
    isPrediction: true,
  },
  {
    text: "Your humor style is mostly...",
    category: "fun",
    type: "multiple_choice",
    options: [
      { text: "Witty and dry", value: "dry" },
      { text: "Sarcastic and sharp", value: "sarcastic" },
      { text: "Silly and goofy", value: "silly" },
      { text: "Dark and unexpected", value: "dark" },
    ],
    isPrediction: true,
  },
  {
    text: "What sounds most exciting on a random Tuesday night?",
    category: "fun",
    type: "multiple_choice",
    options: [
      { text: "Spontaneous dinner with friends", value: "dinner" },
      { text: "Learning something new online", value: "learn" },
      { text: "Working on a creative project", value: "create" },
      { text: "Complete relaxation — do nothing", value: "relax" },
    ],
    isPrediction: true,
  },
];

async function seed() {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected!');

  // Clear existing questions
  await Question.deleteMany({});
  console.log('🗑️  Cleared existing questions');

  // Insert all questions
  const result = await Question.insertMany(questions);
  console.log(`✅ Seeded ${result.length} questions`);

  // Print breakdown
  const breakdown: Record<string, number> = {};
  for (const q of questions) {
    breakdown[q.category] = (breakdown[q.category] || 0) + 1;
  }
  console.log('\n📊 Question breakdown:');
  for (const [cat, count] of Object.entries(breakdown)) {
    console.log(`   ${cat}: ${count} questions`);
  }

  await mongoose.disconnect();
  console.log('\n🎉 Seeding complete!');
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});

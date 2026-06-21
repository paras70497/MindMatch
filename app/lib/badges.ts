export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export function assignBadges(
  overallScore: number,
  categoryScores: {
    values: number;
    lifestyle: number;
    communication: number;
    personality: number;
    fun: number;
  },
  predictionAccuracy: number
): string[] {
  const badges: string[] = [];

  // Mind Readers — prediction accuracy > 75%
  if (predictionAccuracy >= 75) {
    badges.push('Mind Readers');
  }

  // Same Brain — overall score >= 88%
  if (overallScore >= 88) {
    badges.push('Same Brain');
  }

  // Opposites Attract — overall 35–65%
  if (overallScore >= 35 && overallScore <= 65) {
    badges.push('Opposites Attract');
  }

  // Chaos Duo — high variance across categories
  const scores = Object.values(categoryScores);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / scores.length;
  if (variance > 400) {
    badges.push('Chaos Duo');
  }

  // Planning Masters — Lifestyle + Values both >= 80%
  if (categoryScores.lifestyle >= 80 && categoryScores.values >= 80) {
    badges.push('Planning Masters');
  }

  // Adventure Pair — Fun category >= 80%
  if (categoryScores.fun >= 80) {
    badges.push('Adventure Pair');
  }

  // Value Aligned — Values >= 90%
  if (categoryScores.values >= 90) {
    badges.push('Value Aligned');
  }

  // Communication Champions — Communication >= 85%
  if (categoryScores.communication >= 85) {
    badges.push('Communication Champions');
  }

  // Ensure at least one badge
  if (badges.length === 0) {
    if (overallScore >= 50) {
      badges.push('Compatible Pair');
    } else {
      badges.push('Unique Combo');
    }
  }

  return badges;
}

export const BADGE_DETAILS: Record<string, Badge> = {
  'Mind Readers': {
    id: 'mind-readers',
    name: 'Mind Readers',
    description: 'You predicted each other\'s answers with uncanny accuracy.',
    icon: 'psychology',
  },
  'Same Brain': {
    id: 'same-brain',
    name: 'Same Brain',
    description: 'Your thinking is almost perfectly aligned.',
    icon: 'neurology',
  },
  'Opposites Attract': {
    id: 'opposites-attract',
    name: 'Opposites Attract',
    description: 'Your differences create a fascinating dynamic.',
    icon: 'compare_arrows',
  },
  'Chaos Duo': {
    id: 'chaos-duo',
    name: 'Chaos Duo',
    description: 'Wild differences in some areas, perfect unity in others.',
    icon: 'bolt',
  },
  'Planning Masters': {
    id: 'planning-masters',
    name: 'Planning Masters',
    description: 'You share the same vision for life\'s big picture.',
    icon: 'event_note',
  },
  'Adventure Pair': {
    id: 'adventure-pair',
    name: 'Adventure Pair',
    description: 'Your sense of fun is completely in sync.',
    icon: 'celebration',
  },
  'Value Aligned': {
    id: 'value-aligned',
    name: 'Value Aligned',
    description: 'Your core values are deeply aligned.',
    icon: 'favorite',
  },
  'Communication Champions': {
    id: 'communication-champions',
    name: 'Communication Champions',
    description: 'You understand each other on a deeper level.',
    icon: 'forum',
  },
  'Compatible Pair': {
    id: 'compatible-pair',
    name: 'Compatible Pair',
    description: 'You have a solid foundation of compatibility.',
    icon: 'handshake',
  },
  'Unique Combo': {
    id: 'unique-combo',
    name: 'Unique Combo',
    description: 'You bring different energies that complement each other.',
    icon: 'auto_awesome',
  },
};

export function getCompatibilityLabel(score: number): string {
  if (score >= 90) return 'Exceptional Match';
  if (score >= 80) return 'Highly Compatible';
  if (score >= 70) return 'Very Compatible';
  if (score >= 60) return 'Good Match';
  if (score >= 50) return 'Compatible';
  if (score >= 40) return 'Interesting Mix';
  return 'Unique Dynamic';
}

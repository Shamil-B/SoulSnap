export const MOOD_MAP: Record<string, { emoji: string; label: string }> = {
  energized: { emoji: '🔥', label: 'Energized' },
  calm: { emoji: '😌', label: 'Calm' },
  inspired: { emoji: '💡', label: 'Inspired' },
  frustrated: { emoji: '😤', label: 'Frustrated' },
  reflective: { emoji: '🌙', label: 'Reflective' },
  happy: { emoji: '😊', label: 'Happy' },
  sad: { emoji: '😢', label: 'Sad' },
  angry: { emoji: '😠', label: 'Angry' },
  anxious: { emoji: '😰', label: 'Anxious' },
  excited: { emoji: '🤩', label: 'Excited' },
  tired: { emoji: '😴', label: 'Tired' },
  sick: { emoji: '🤒', label: 'Sick' },
  creative: { emoji: '🎨', label: 'Creative' },
  nostalgic: { emoji: '📼', label: 'Nostalgic' },
  grateful: { emoji: '🙏', label: 'Grateful' },
  loved: { emoji: '🥰', label: 'Loved' },
  confident: { emoji: '😎', label: 'Confident' },
  curious: { emoji: '🧐', label: 'Curious' },
  overwhelmed: { emoji: '🤯', label: 'Overwhelmed' },
  relaxed: { emoji: '🛋️', label: 'Relaxed' },
  focused: { emoji: '🎯', label: 'Focused' },
  confused: { emoji: '😵‍💫', label: 'Confused' },
  adventurous: { emoji: '🌍', label: 'Adventurous' },
  romantic: { emoji: '🌹', label: 'Romantic' },
  silly: { emoji: '🤪', label: 'Silly' },
  lonely: { emoji: '🥀', label: 'Lonely' },
  proud: { emoji: '🏆', label: 'Proud' },
  bored: { emoji: '🥱', label: 'Bored' },
  hopeful: { emoji: '🌈', label: 'Hopeful' },
  jealous: { emoji: '😒', label: 'Jealous' }
};

export const MOODS_LIST = Object.entries(MOOD_MAP).map(([value, { emoji, label }]) => ({
  value, emoji, label
}));

export function getMoodInfo(mood?: string): { emoji: string; label: string } | null {
  return mood ? MOOD_MAP[mood] ?? null : null;
}

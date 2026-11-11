/**
 * Speech Synthesis (Text-to-Speech) & Speech Recognition (Speech-to-Text)
 * for English vocabulary listening and read-aloud practice.
 */

import { ReadAloudEvaluation } from '../types';

// Cached preferred English voice
let preferredVoice: SpeechSynthesisVoice | null = null;

function loadVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // Try finding high quality US or UK English voice
  const voice =
    voices.find(v => v.lang === 'en-US' && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny'))) ||
    voices.find(v => v.lang.startsWith('en-US')) ||
    voices.find(v => v.lang.startsWith('en-GB')) ||
    voices.find(v => v.lang.startsWith('en')) ||
    voices[0];

  preferredVoice = voice || null;
  return preferredVoice;
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoice();
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoice();
  };
}

/**
 * Pronounce an English word or phrase using native browser TTS
 */
export function playPronunciation(text: string, rate: number = 0.85, pitch: number = 1.0): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate; // 0.85 is ideal for learning pronunciation
    utterance.pitch = pitch;

    if (!preferredVoice) {
      loadVoice();
    }
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Calculate Levenshtein distance string similarity (0.0 to 1.0)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim().replace(/[^a-z]/g, '');
  const s2 = str2.toLowerCase().trim().replace(/[^a-z]/g, '');

  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;

  // Exact substring check
  if (s2.includes(s1) || s1.includes(s2)) {
    return Math.max(s1.length, s2.length) > 0 ? 0.85 : 1.0;
  }

  const track = Array(s2.length + 1).fill(null).map(() =>
    Array(s1.length + 1).fill(null)
  );

  for (let i = 0; i <= s1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= s2.length; j += 1) {
    track[j][0] = j;
  }

  for (let j = 1; j <= s2.length; j += 1) {
    for (let i = 1; i <= s1.length; i += 1) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  const distance = track[s2.length][s1.length];
  const maxLen = Math.max(s1.length, s2.length);
  return Math.max(0, 1 - distance / maxLen);
}

/**
 * Check if the browser supports Speech Recognition
 */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(
    (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
  );
}

/**
 * Start listening for student's voice and evaluate against target word
 */
export function startVoiceEvaluation(
  targetWord: string,
  onResult: (evaluation: ReadAloudEvaluation) => void,
  onError: (errMsg: string) => void
): { stop: () => void } {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognitionClass) {
    onError('Browser does not support Speech Recognition. You can use the practice buttons below!');
    return { stop: () => {} };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognition = new SpeechRecognitionClass() as any;
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 3;

  let stoppedManually = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onresult = (event: any) => {
    let bestSpokenText = '';
    let maxSimilarity = 0;

    for (let i = 0; i < event.results[0].length; i++) {
      const transcript = event.results[0][i].transcript;
      const sim = calculateSimilarity(targetWord, transcript);
      if (sim > maxSimilarity || !bestSpokenText) {
        maxSimilarity = sim;
        bestSpokenText = transcript;
      }
    }

    const accuracyScore = Math.round(maxSimilarity * 100);
    let stars: 1 | 2 | 3 = 1;
    let feedbackText = 'Good try! Keep practicing!';
    const isCorrect = accuracyScore >= 60;

    if (accuracyScore >= 85) {
      stars = 3;
      feedbackText = '🎉 Outstanding! Native-like pronunciation! (太棒了！发音纯正！)';
    } else if (accuracyScore >= 60) {
      stars = 2;
      feedbackText = '👍 Very Good! Clear and bright! (读得很棒！口齿清晰！)';
    } else {
      stars = 1;
      feedbackText = '💪 Nice effort! Listen to the teacher and try once more! (加油！再听一次范读试一试！)';
    }

    onResult({
      spokenText: bestSpokenText.trim(),
      accuracyScore,
      stars,
      feedbackText,
      isCorrect
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onerror = (event: any) => {
    if (stoppedManually) return;
    if (event.error === 'no-speech') {
      onError('No speech detected. Please speak clearly into your microphone.');
    } else if (event.error === 'not-allowed') {
      onError('Microphone access was denied. Please allow microphone permissions or use practice mode.');
    } else {
      onError(`Speech recognition note: ${event.error}. You can practice with manual review!`);
    }
  };

  try {
    recognition.start();
  } catch {
    onError('Could not start microphone. You can practice with manual review mode.');
  }

  return {
    stop: () => {
      stoppedManually = true;
      try {
        recognition.stop();
      } catch {
        // ignore
      }
    }
  };
}

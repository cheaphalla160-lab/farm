import { LeaderboardEntry } from '../types';

export const AVATAR_OPTIONS = [
  { id: 'farmer', emoji: '🧑‍🌾', name: 'Little Farmer (小农夫)' },
  { id: 'rabbit', emoji: '🐰', name: 'Sunny Bunny (小兔子)' },
  { id: 'bear', emoji: '🐻', name: 'Honey Bear (小熊)' },
  { id: 'fox', emoji: '🦊', name: 'Clever Fox (小狐狸)' },
  { id: 'cat', emoji: '🐱', name: 'Milo Kitty (小猫咪)' },
  { id: 'puppy', emoji: '🐶', name: 'Lucky Puppy (幸运小狗)' },
  { id: 'bee', emoji: '🐝', name: 'Busy Bee (勤劳小蜜蜂)' },
  { id: 'owl', emoji: '🦉', name: 'Wise Owl (智慧猫头鹰)' }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: '1',
    name: 'Emily Chen (陈欣雨)',
    avatar: '🐰',
    score: 1850,
    applesCollected: 18,
    readAloudStars: 18,
    accuracy: 98,
    date: '2026-11-10',
    badge: '🏆 Gold Harvester'
  },
  {
    id: '2',
    name: 'Lucas Wang (王梓轩)',
    avatar: '🧑‍🌾',
    score: 1720,
    applesCollected: 17,
    readAloudStars: 16,
    accuracy: 95,
    date: '2026-11-10',
    badge: '🥈 Silver Harvester'
  },
  {
    id: '3',
    name: 'Sophia Zhang (张涵)',
    avatar: '🦊',
    score: 1600,
    applesCollected: 16,
    readAloudStars: 15,
    accuracy: 94,
    date: '2026-11-11',
    badge: '🥉 Bronze Harvester'
  },
  {
    id: '4',
    name: 'Leo Li (李浩宇)',
    avatar: '🐻',
    score: 1420,
    applesCollected: 14,
    readAloudStars: 14,
    accuracy: 91,
    date: '2026-11-11',
    badge: '⭐ Farm Star'
  },
  {
    id: '5',
    name: 'Mia Liu (刘雨薇)',
    avatar: '🐝',
    score: 1280,
    applesCollected: 13,
    readAloudStars: 12,
    accuracy: 89,
    date: '2026-11-11',
    badge: '🌱 Green Sprout'
  }
];

const STORAGE_KEY = 'farm_english_leaderboard_v1';
const CURRENT_PLAYER_KEY = 'farm_english_player_v1';

export function getStoredLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_LEADERBOARD;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_LEADERBOARD;
  } catch {
    return INITIAL_LEADERBOARD;
  }
}

export function saveLeaderboard(entries: LeaderboardEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore
  }
}

export function getStoredPlayer(): { name: string; avatar: string } {
  try {
    const raw = localStorage.getItem(CURRENT_PLAYER_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { name: 'Super Farmer (我是农场小能手)', avatar: '🧑‍🌾' };
}

export function saveStoredPlayer(player: { name: string; avatar: string }): void {
  try {
    localStorage.setItem(CURRENT_PLAYER_KEY, JSON.stringify(player));
  } catch {
    // ignore
  }
}

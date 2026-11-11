/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveTab, VocabularyWord } from './types';
import { Navbar } from './components/Navbar';
import { FarmIllustration } from './components/FarmIllustration';
import { AppleTreeGame } from './components/AppleTreeGame';
import { ReadAloudModal } from './components/ReadAloudModal';
import { WordCardsView } from './components/WordCardsView';
import { LeaderboardView } from './components/LeaderboardView';
import { TeacherPrepView } from './components/TeacherPrepView';
import { PlayerModal } from './components/PlayerModal';
import { CertificateModal } from './components/CertificateModal';
import { getStoredPlayer } from './data/leaderboard';
import { soundManager } from './utils/sound';

import { FarmExplorerGame } from './components/FarmExplorerGame';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('explorer');
  const [score, setScore] = useState(0);
  const [applesCount, setApplesCount] = useState(0);
  const [exploredCount, setExploredCount] = useState(0);
  const [activeReadAloudWord, setActiveReadAloudWord] = useState<VocabularyWord | null>(null);
  const [highlightedFarmWord, setHighlightedFarmWord] = useState<string | null>(null);
  const [basketBounce, setBasketBounce] = useState(false);

  // Modals
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [player, setPlayer] = useState({ name: 'Super Farmer', avatar: '🧑‍🌾' });

  useEffect(() => {
    setPlayer(getStoredPlayer());
  }, []);

  const handleHarvestWord = (word: VocabularyWord) => {
    // Apple just dropped into basket
    setBasketBounce(true);
    setTimeout(() => setBasketBounce(false), 800);

    // Open read-aloud modal
    setActiveReadAloudWord(word);
  };

  const handleFoundWordInExplorer = (word: VocabularyWord) => {
    setActiveReadAloudWord(word);
  };

  const handleCloseReadAloud = (starsEarned: number, bonusScore: number) => {
    setActiveReadAloudWord(null);
    setScore(prev => prev + bonusScore);
  };

  const handleSelectFarmElement = (wordId: string) => {
    setHighlightedFarmWord(wordId);
    setTimeout(() => setHighlightedFarmWord(null), 2500);
  };

  const handleStartGameWithWord = (word: VocabularyWord) => {
    setActiveTab('explorer');
    setHighlightedFarmWord(word.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-100 text-slate-800 flex flex-col font-['Quicksand',sans-serif]">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        score={score}
        applesCount={applesCount}
        onOpenPlayerModal={() => setShowPlayerModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col gap-6">
        {/* TAB 1: FARM EXPLORER (Step-by-step walking along farm trail & 'Where is...?' quest) */}
        {activeTab === 'explorer' && (
          <section aria-label="Farm Explorer Game">
            <FarmExplorerGame
              score={score}
              setScore={setScore}
              exploredCount={exploredCount}
              setExploredCount={setExploredCount}
              onFoundWordForReadAloud={handleFoundWordInExplorer}
              playerAvatar={player.avatar}
            />
          </section>
        )}

        {/* TAB 2: APPLE PICKING MINI-GAME (Harvesting apples on the tree) */}
        {activeTab === 'apple-picking' && (
          <div className="flex flex-col gap-6">
            <section aria-label="Interactive Farm Panorama">
              <FarmIllustration
                harvestedApplesCount={applesCount}
                highlightWord={highlightedFarmWord}
                onSelectWord={handleSelectFarmElement}
                basketBounce={basketBounce}
              />
            </section>

            <section aria-label="Apple Tree Game">
              <AppleTreeGame
                score={score}
                setScore={setScore}
                applesCount={applesCount}
                setApplesCount={setApplesCount}
                onHarvestWord={handleHarvestWord}
                onSelectFarmElement={handleSelectFarmElement}
              />
            </section>
          </div>
        )}

        {/* TAB 2: WORD CARDS */}
        {activeTab === 'learn' && (
          <WordCardsView onStartGameWithWord={handleStartGameWithWord} />
        )}

        {/* TAB 3: LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <LeaderboardView
            currentScore={score}
            applesCollected={applesCount}
            onOpenCertificate={() => setShowCertificateModal(true)}
          />
        )}

        {/* TAB 4: TEACHER LESSON PREPARATION ASSISTANT */}
        {activeTab === 'teacher-prep' && (
          <TeacherPrepView />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white/70 backdrop-blur-xs border-t-2 border-amber-200 py-4 px-4 text-center text-xs text-amber-900/80">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-medium">
          <p>
            🍎 <strong className="text-amber-950 font-bold">Picking Apples on the Farm</strong> · 高年级英语农业词汇视听跟读互动课堂
          </p>
          <div className="flex items-center gap-3 text-slate-500">
            <span>farm · farmer · sunshine · basket · apple · potato</span>
          </div>
        </div>
      </footer>

      {/* Read Aloud Modal (Triggered when apple is picked) */}
      {activeReadAloudWord && (
        <ReadAloudModal
          word={activeReadAloudWord}
          onClose={handleCloseReadAloud}
        />
      )}

      {/* Student Profile / Avatar Modal */}
      {showPlayerModal && (
        <PlayerModal
          currentName={player.name}
          currentAvatar={player.avatar}
          onSave={(name, avatar) => setPlayer({ name, avatar })}
          onClose={() => setShowPlayerModal(false)}
        />
      )}

      {/* Certificate of Achievement Modal */}
      {showCertificateModal && (
        <CertificateModal
          studentName={player.name}
          avatar={player.avatar}
          score={score}
          applesCollected={applesCount}
          onClose={() => setShowCertificateModal(false)}
        />
      )}
    </div>
  );
}

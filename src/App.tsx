/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Navbar } from './components/Navbar';
import { MapExplorer } from './components/MapExplorer';
import { ArenaMultiplayer } from './components/ArenaMultiplayer';
import { ReviewNotebook } from './components/ReviewNotebook';
import { LeaderboardQuests } from './components/LeaderboardQuests';
import { QuizModal } from './components/QuizModal';
import { PlayerProfileModal } from './components/PlayerProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { TutorialModal } from './components/TutorialModal';
import { LevelUpModal } from './components/LevelUpModal';
import { QUESTIONS_DATABASE } from './data/questions';
import { MapStage, Question } from './types';

function MainApp() {
  const { newLevelModal, setNewLevelModal } = useGame();
  const [activeTab, setActiveTab] = useState<'map' | 'arena' | 'review' | 'leaderboard'>('map');

  // Modals state
  const [activeQuizStage, setActiveQuizStage] = useState<MapStage | null>(null);
  const [customQuizQuestions, setCustomQuizQuestions] = useState<{ questions: Question[]; title: string } | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileInitialTab, setProfileInitialTab] = useState<'profile' | 'save'>('profile');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  // Start exploration stage quiz
  const handleStartStage = (stage: MapStage) => {
    // Filter questions appropriate for stage
    let relevantQuestions: Question[] = [];
    if (stage.mapType === 'vietnam') {
      relevantQuestions = QUESTIONS_DATABASE.filter(q => q.topic === 'vietnam' || q.topic === 'culture');
    } else if (stage.mapType === 'earth') {
      relevantQuestions = QUESTIONS_DATABASE.filter(q => q.topic === 'geography' || q.topic === 'history' || q.topic === 'science');
    } else {
      relevantQuestions = QUESTIONS_DATABASE.filter(q => q.topic === 'astronomy' || q.topic === 'science');
    }

    // If boss stage, pick harder questions
    if (stage.isBoss) {
      const bossPool = relevantQuestions.filter(q => q.difficulty === 'boss' || q.difficulty === 'hard');
      if (bossPool.length >= 3) {
        relevantQuestions = [...bossPool, ...relevantQuestions].slice(0, stage.questionsCount);
      }
    }

    // Shuffle and pick stage.questionsCount
    const shuffled = [...relevantQuestions].sort(() => 0.5 - Math.random()).slice(0, stage.questionsCount);
    // If not enough in category, fill with general pool
    if (shuffled.length < stage.questionsCount) {
      const more = QUESTIONS_DATABASE.filter(q => !shuffled.includes(q)).slice(0, stage.questionsCount - shuffled.length);
      shuffled.push(...more);
    }

    setActiveQuizStage(stage);
    setCustomQuizQuestions({ questions: shuffled, title: stage.name });
  };

  const handleStartCustomQuiz = (questions: Question[], title: string) => {
    setActiveQuizStage(null);
    setCustomQuizQuestions({ questions, title });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Top Navbar HUD */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenProfile={() => {
          setProfileInitialTab('profile');
          setIsProfileOpen(true);
        }}
        onOpenSaveModal={() => {
          setProfileInitialTab('save');
          setIsProfileOpen(true);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'map' && (
          <MapExplorer onStartStage={handleStartStage} />
        )}

        {activeTab === 'arena' && (
          <ArenaMultiplayer onBackToMap={() => setActiveTab('map')} />
        )}

        {activeTab === 'review' && (
          <ReviewNotebook onStartCustomQuiz={handleStartCustomQuiz} />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardQuests />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>Thiên Hà Tri Thức © 2026 • Nền tảng học tập & thám hiểm kiến thức Việt Nam & Vũ Trụ</p>
        <p className="mt-1 text-slate-600">Được thiết kế phục vụ cộng đồng học sinh, sinh viên và người yêu khoa học</p>
      </footer>

      {/* ================= MODALS ================= */}

      {/* Active Quiz / Stage Modal */}
      {customQuizQuestions && (
        <QuizModal
          stage={activeQuizStage || undefined}
          customTitle={customQuizQuestions.title}
          questions={customQuizQuestions.questions}
          onClose={() => {
            setActiveQuizStage(null);
            setCustomQuizQuestions(null);
          }}
        />
      )}

      {/* Player Profile & Save System Modal */}
      {isProfileOpen && (
        <PlayerProfileModal
          initialTab={profileInitialTab}
          onClose={() => setIsProfileOpen(false)}
        />
      )}

      {/* Settings & Accessibility Modal */}
      {isSettingsOpen && (
        <SettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}

      {/* Tutorial Walkthrough Modal */}
      {isTutorialOpen && (
        <TutorialModal onClose={() => setIsTutorialOpen(false)} />
      )}

      {/* Level Up Fanfare Celebration Modal */}
      {newLevelModal !== null && (
        <LevelUpModal
          level={newLevelModal}
          onClose={() => setNewLevelModal(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <MainApp />
    </GameProvider>
  );
}

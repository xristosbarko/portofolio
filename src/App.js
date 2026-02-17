import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import HeroPanel from './components/HeroPanel';
import StatsPanel from './components/StatsPanel';
import SkillTree from './components/SkillTree';
import QuestLog from './components/QuestLog';
import Achievements from './components/Achievements';
import ParticleField from './components/ParticleField';
import ScanLines from './components/ScanLines';
import LevelUp from './components/LevelUp';

import { sounds } from './utils/sounds';

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

// Cumulative session XP needed to reach each level
// Total available XP ~17,410 (+ 1290 Konami) — designed to hit LV.50 at max
export const LEVEL_CONFIG = [
  { level: 47, cumXPStart: 0,     xpNeeded: 4000  }, // 0    → 4000
  { level: 48, cumXPStart: 4000,  xpNeeded: 5000  }, // 4000 → 9000
  { level: 49, cumXPStart: 9000,  xpNeeded: 7500  }, // 9000 → 16500
  { level: 50, cumXPStart: 16500, xpNeeded: null  }, // MAX — bar stays full
];
export const MAX_LEVEL = 50;

export function getLevelInfo(sessionXP) {
  // Find current level config entry
  let current = LEVEL_CONFIG[0];
  for (const cfg of LEVEL_CONFIG) {
    if (sessionXP >= cfg.cumXPStart) current = cfg;
  }
  const xpInLevel  = sessionXP - current.cumXPStart;
  const isMaxLevel = current.level === MAX_LEVEL;
  const xpNeeded   = current.xpNeeded ?? 0;
  const barPercent = isMaxLevel ? 100 : Math.min((xpInLevel / xpNeeded) * 100, 100);
  return {
    level:       current.level,
    xpInLevel,
    xpNeeded:    current.xpNeeded,
    barPercent,
    isMaxLevel,
  };
}

function App() {
  const [activeTab,      setActiveTab]      = useState('stats');
  const [sessionXP,      setSessionXP]      = useState(0);
  const [secretFound,    setSecretFound]    = useState(false);
  const [notifications,  setNotifications]  = useState([]);
  // ── Lifted one-time-XP state (survives tab switching) ──────────────────
  const [visitedTabs,    setVisitedTabs]    = useState(['stats']);
  const [acceptedQuests, setAcceptedQuests] = useState([]);
  const [expandedOnce,   setExpandedOnce]   = useState([]);
  const [masteredSkills, setMasteredSkills] = useState([]);
  const [examinedFeats,  setExaminedFeats]  = useState([]);
  const [diceRolled,     setDiceRolled]     = useState(false);
  // ── Level up overlay ───────────────────────────────────────────────────
  const [levelUpInfo,    setLevelUpInfo]    = useState(null);
  const levelUpTriggered = useRef(new Set());
  const visitorXPAwarded = useRef(false);

  const levelInfo = getLevelInfo(sessionXP);

  const addNotification = useCallback((msg, color = '#00f5ff') => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { id, msg, color }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000);
  }, []);

  const awardXP = useCallback((amount) => {
    setSessionXP(prev => {
      const next = prev + amount;
      // Trigger level-up overlay for each threshold crossed
      LEVEL_CONFIG.forEach(({ level, cumXPStart }) => {
        if (level === 47) return; // base level, no "up"
        if (prev < cumXPStart && next >= cumXPStart && !levelUpTriggered.current.has(level)) {
          levelUpTriggered.current.add(level);
          setTimeout(() => { sounds.levelUp(); setLevelUpInfo(level); }, 200);
        }
      });
      return next;
    });
  }, []);

  const triggerKonami = useCallback(() => {
    setSecretFound(true);
    awardXP(1290);
    sounds.secret();
    addNotification('🎮 KONAMI CODE! +1290 XP — Secret Unlocked!', '#ff2d78');
  }, [addNotification, awardXP]);

  useEffect(() => {
    if (visitorXPAwarded.current) return;
    visitorXPAwarded.current = true;
    const t = setTimeout(() => {
      awardXP(50);
      sounds.xpGain();
      addNotification('+50 XP — Visitor arrived!', '#00f5ff');
    }, 800);
    return () => clearTimeout(t);
  }, [addNotification, awardXP]);

  useEffect(() => {
    let sequence = [];
    const handleKey = (e) => {
      sequence = [...sequence, e.key].slice(-10);
      if (sequence.join(',') === KONAMI.join(',')) { triggerKonami(); sequence = []; }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [triggerKonami]);

  const handleTabClick = (tab) => {
    sounds.click();
    setActiveTab(tab);
    if (!visitedTabs.includes(tab)) {
      const xpMap = { stats: 10, skills: 25, quests: 15, achievements: 20 };
      const gained = xpMap[tab] || 10;
      awardXP(gained);
      sounds.xpGain();
      setVisitedTabs(prev => [...prev, tab]);
      addNotification(`+${gained} XP — Explored ${tab}`, '#7b2fff');
    }
  };

  const tabs = [
    { id: 'stats',        label: '📊 Stats',  shortLabel: 'Stats'  },
    { id: 'skills',       label: '🌳 Skills', shortLabel: 'Skills' },
    { id: 'quests',       label: '⚔️ Quests', shortLabel: 'Quests' },
    { id: 'achievements', label: '🏆 Feats',  shortLabel: 'Feats'  },
  ];

  return (
    <div className="app">
      <ParticleField />
      <ScanLines />

      {levelUpInfo && <LevelUp level={levelUpInfo} onDone={() => setLevelUpInfo(null)} />}

      <div className="notifications">
        {notifications.map(n => (
          <div key={n.id} className="notification" style={{ borderColor: n.color, color: n.color }}>
            {n.msg}
          </div>
        ))}
      </div>

      <div className="game-container">
        <header className="game-header">
          <div className="header-left">
            <span className="game-logo">⚔️ DEV.CHARACTER</span>
            <span className="header-version">v{levelInfo.level}.0</span>
          </div>
          <div className="header-right">
            <div className="visit-xp">
              <span className="xp-label">SESSION XP</span>
              <span className="xp-value" style={{ color: '#00f5ff' }}>+{sessionXP}</span>
            </div>
            {secretFound && <span className="secret-badge">🎮 KONAMI</span>}
          </div>
        </header>

        <HeroPanel sessionXP={sessionXP} secretFound={secretFound} levelInfo={levelInfo} />

        <nav className="tab-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
            >
              <span className="tab-full">{tab.label}</span>
              <span className="tab-short">{tab.shortLabel}</span>
            </button>
          ))}
        </nav>

        <main className="tab-content">
          {activeTab === 'stats' && (
            <StatsPanel
              addNotification={addNotification} awardXP={awardXP}
              diceRolled={diceRolled} setDiceRolled={setDiceRolled}
            />
          )}
          {activeTab === 'skills' && (
            <SkillTree
              addNotification={addNotification} awardXP={awardXP}
              masteredSkills={masteredSkills} setMasteredSkills={setMasteredSkills}
            />
          )}
          {activeTab === 'quests' && (
            <QuestLog
              addNotification={addNotification} awardXP={awardXP}
              acceptedQuests={acceptedQuests} setAcceptedQuests={setAcceptedQuests}
              expandedOnce={expandedOnce}     setExpandedOnce={setExpandedOnce}
            />
          )}
          {activeTab === 'achievements' && (
            <Achievements
              secretFound={secretFound} addNotification={addNotification} awardXP={awardXP}
              examinedFeats={examinedFeats} setExaminedFeats={setExaminedFeats}
            />
          )}
        </main>

        <footer className="game-footer">
          <span>[ Press ↑↑↓↓←→←→BA for a secret ] &nbsp;|&nbsp; Built with React + GitHub Actions</span>
        </footer>
      </div>
    </div>
  );
}

export default App;

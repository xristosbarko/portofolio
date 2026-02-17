import React, { useRef } from 'react';
import { ACHIEVEMENTS } from '../data/character';
import { sounds } from '../utils/sounds';
import './Achievements.css';

export default function Achievements({ secretFound, addNotification, awardXP, examinedFeats, setExaminedFeats }) {
  const clickCountRef = useRef(0);

  const achievements = ACHIEVEMENTS.map(a => {
    if (a.id === 'secret') return { ...a, unlocked: secretFound };
    return a;
  });

  const handleAchievementClick = (a) => {
    if (!a.unlocked) {
      clickCountRef.current += 1;
      sounds.locked();
      addNotification(`🔒 ${a.hint || 'Keep exploring...'}`, '#666699');
      if (clickCountRef.current >= 5 && !secretFound) {
        addNotification('💡 Try the Konami code: ↑↑↓↓←→←→BA', '#ff6b00');
      }
      return;
    }
    if (!examinedFeats.includes(a.id)) {
      setExaminedFeats(prev => [...prev, a.id]);
      awardXP(20);
      sounds.achievement();
      addNotification(`+20 XP — Feat inspected: ${a.name}`, '#ffcc00');
    } else {
      sounds.click();
    }
  };

  const unlocked = achievements.filter(a => a.unlocked).length;
  const total    = achievements.length;

  return (
    <div className="achievements-panel">
      <div className="card achiev-progress-card">
        <div className="achiev-progress-top">
          <div>
            <h2 className="card-title" style={{ color: '#ffcc00' }}>🏆 FEATS OF STRENGTH</h2>
            <p className="achiev-sub">{unlocked} / {total} unlocked</p>
          </div>
          <div className="achiev-completion">
            <span className="completion-pct" style={{ color: '#ffcc00' }}>
              {Math.round((unlocked / total) * 100)}%
            </span>
            <span className="completion-label">COMPLETE</span>
          </div>
        </div>
        <div className="progress-bar-wrap achiev-bar">
          <div
            className="progress-bar-fill"
            style={{
              width: `${(unlocked / total) * 100}%`,
              background: 'linear-gradient(90deg, #ff6b00, #ffcc00)',
              boxShadow: '0 0 10px #ffcc00'
            }}
          />
        </div>
      </div>

      <div className="achiev-grid">
        {achievements.map((a, i) => (
          <div
            key={a.id}
            className={`achiev-card ${a.unlocked ? 'unlocked' : 'locked'}`}
            style={{ animationDelay: `${i * 0.07}s` }}
            onClick={() => handleAchievementClick(a)}
            title={a.unlocked ? a.desc : '???'}
          >
            <div className="achiev-icon">{a.unlocked ? a.icon : '🔒'}</div>
            <div className="achiev-info">
              <div className="achiev-name">{a.unlocked ? a.name : '???'}</div>
              <div className="achiev-desc">{a.unlocked ? a.desc : 'Locked achievement'}</div>
            </div>
            {a.unlocked && <div className="achiev-star">★</div>}
            {!a.unlocked && a.hint && <div className="achiev-hint">?</div>}
          </div>
        ))}
      </div>

      {secretFound && (
        <div className="secret-reveal card">
          <div className="secret-reveal-inner">
            <span className="secret-icon">🎮</span>
            <div>
              <div className="secret-title">SECRET ACHIEVEMENT UNLOCKED!</div>
              <div className="secret-sub">You entered the Konami Code. Legend status achieved.</div>
            </div>
            <span className="secret-xp">+1290 XP</span>
          </div>
        </div>
      )}
    </div>
  );
}

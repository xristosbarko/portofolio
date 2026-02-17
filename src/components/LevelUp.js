import React, { useEffect } from 'react';
import './LevelUp.css';

export default function LevelUp({ level, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="levelup-overlay" onClick={onDone}>
      <div className="levelup-box">
        <div className="levelup-flash" />
        <div className="levelup-label">LEVEL UP!</div>
        <div className="levelup-level">LV.{level}</div>
        <div className="levelup-sub">⚡ New power unlocked ⚡</div>
        <div className="levelup-tap">[ tap to continue ]</div>
      </div>
    </div>
  );
}

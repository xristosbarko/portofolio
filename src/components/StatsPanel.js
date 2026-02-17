import React, { useState, useEffect } from 'react';
import { STATS } from '../data/character';
import { sounds } from '../utils/sounds';
import './StatsPanel.css';

export default function StatsPanel({ addNotification, awardXP, diceRolled, setDiceRolled }) {
  const [animated,    setAnimated]    = useState(false);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [rolledStats, setRolledStats] = useState(null);
  const [rolling,     setRolling]     = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

  const rollDice = () => {
    if (rolling) return;
    setRolling(true);
    sounds.click();
    addNotification('🎲 Rolling stats...', '#ff6b00');

    let count = 0;
    const interval = setInterval(() => {
      sounds.click();
      setRolledStats(STATS.map(s => ({ ...s, rolled: Math.floor(Math.random() * 100) + 1 })));
      count++;
      if (count > 8) {
        clearInterval(interval);
        setRolledStats(null);
        setRolling(false);
        if (!diceRolled) {
          setDiceRolled(true);
          awardXP(30);
          sounds.xpGain();
          addNotification('+30 XP — Dice rolled!', '#ff6b00');
        } else {
          addNotification('🎲 Stats re-rolled! (no XP — already earned)', '#666699');
        }
      }
    }, 80);
  };

  const getStatColor = (value) => {
    if (value >= 90) return '#00f5ff';
    if (value >= 80) return '#7b2fff';
    if (value >= 70) return '#ff2d78';
    return '#ff6b00';
  };

  const getStatTier = (value) => {
    if (value >= 90) return 'LEGENDARY';
    if (value >= 80) return 'EPIC';
    if (value >= 70) return 'RARE';
    return 'UNCOMMON';
  };

  return (
    <div className="stats-panel">
      <div className="card stats-card">
        <div className="stats-card-header">
          <h2 className="card-title" style={{ color: 'var(--neon-cyan)' }}>⬡ CHARACTER ATTRIBUTES</h2>
          <button className={`roll-btn ${rolling ? 'rolling' : ''}`} onClick={rollDice} disabled={rolling}>
            {rolling ? '🎲 ROLLING...' : '🎲 ROLL STATS'}
          </button>
        </div>

        <div className="stat-hex-grid">
          {STATS.map((stat, i) => {
            const displayVal = rolledStats ? rolledStats[i].rolled : stat.value;
            const color = getStatColor(displayVal);
            return (
              <div
                key={stat.name}
                className="stat-hex"
                style={{ '--stat-color': color, animationDelay: `${i * 0.1}s` }}
                onMouseEnter={() => { setHoveredStat(stat); sounds.click(); }}
                onMouseLeave={() => setHoveredStat(null)}
              >
                <div className="stat-hex-inner">
                  <div className="stat-name">{stat.name}</div>
                  <div className="stat-value-big" style={{ color }}>{displayVal}</div>
                  <div className="stat-tier" style={{ color }}>{getStatTier(displayVal)}</div>
                </div>
              </div>
            );
          })}
        </div>

        {hoveredStat && (
          <div className="stat-tooltip">
            <strong>{hoveredStat.label}</strong>: {hoveredStat.desc}
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="card-title" style={{ color: 'var(--neon-purple)' }}>▬ ATTRIBUTE BARS</h2>
        <div className="stat-bars">
          {STATS.map((stat, i) => {
            const color = getStatColor(stat.value);
            return (
              <div key={stat.name} className="stat-bar-row">
                <div className="stat-bar-label">
                  <span className="stat-bar-name">{stat.name}</span>
                  <span className="stat-bar-desc">{stat.label}</span>
                </div>
                <div className="progress-bar-wrap stat-bar-prog">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: animated ? `${stat.value}%` : '0%',
                      background: `linear-gradient(90deg, ${color}88, ${color})`,
                      boxShadow: `0 0 8px ${color}`,
                      transitionDelay: `${i * 0.1}s`
                    }}
                  />
                </div>
                <span className="stat-bar-val" style={{ color }}>{stat.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

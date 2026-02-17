import React, { useState, useEffect } from 'react';
import { CHARACTER } from '../data/character';
import './HeroPanel.css';

export default function HeroPanel({ sessionXP, secretFound, levelInfo }) {
  const [hpAnim, setHpAnim] = useState(0);
  const [mpAnim, setMpAnim] = useState(0);
  const [prevLevel, setPrevLevel] = useState(levelInfo.level);
  const [levelFlash, setLevelFlash] = useState(false);

  useEffect(() => {
    setTimeout(() => setHpAnim(CHARACTER.hp), 500);
    setTimeout(() => setMpAnim(CHARACTER.mp), 700);
  }, []);

  useEffect(() => {
    if (levelInfo.level !== prevLevel) {
      setPrevLevel(levelInfo.level);
      setLevelFlash(true);
      setTimeout(() => setLevelFlash(false), 1500);
    }
  }, [levelInfo.level, prevLevel]);

  const { level, xpInLevel, xpNeeded, barPercent, isMaxLevel } = levelInfo;

  const socials = [
    { label: 'GitHub',   href: CHARACTER.github,            icon: '⌨️' },
    { label: 'LinkedIn', href: CHARACTER.linkedin,          icon: '🔗' },
    { label: 'Email',    href: `mailto:${CHARACTER.email}`, icon: '📡' },
  ];

  return (
    <div className={`hero-panel ${secretFound ? 'secret-active' : ''}`}>
      <div className="hero-avatar-section">
        <div className="hero-avatar">
          <div className="avatar-ring" />
          <div className="avatar-inner">
            <span className="avatar-emoji">🧙‍♂️</span>
          </div>
          <div className={`level-badge ${levelFlash ? 'level-flash' : ''}`}>
            LV.{level}
          </div>
        </div>

        <div className="hero-vitals">
          <div className="vital-row">
            <span className="vital-label">HP</span>
            <div className="progress-bar-wrap vital-bar">
              <div className="progress-bar-fill" style={{
                width: `${hpAnim}%`,
                background: 'linear-gradient(90deg, #ff2d78, #ff6b00)'
              }} />
            </div>
            <span className="vital-num">{CHARACTER.hp}/{CHARACTER.hp}</span>
          </div>
          <div className="vital-row">
            <span className="vital-label">MP</span>
            <div className="progress-bar-wrap vital-bar">
              <div className="progress-bar-fill" style={{
                width: `${mpAnim}%`,
                background: 'linear-gradient(90deg, #7b2fff, #00f5ff)'
              }} />
            </div>
            <span className="vital-num">{CHARACTER.mp}/{CHARACTER.mp}</span>
          </div>
        </div>
      </div>

      <div className="hero-info">
        <div className="hero-name-row">
          <h1 className="hero-name">{CHARACTER.name}</h1>
          <span className="hero-class">{CHARACTER.class}</span>
        </div>
        <p className="hero-title">{CHARACTER.title}</p>
        <p className="hero-bio">{CHARACTER.bio}</p>

        <div className="hero-meta">
          <span className="meta-tag">📍 {CHARACTER.location}</span>
          <span className="meta-tag">⚔️ Available for hire</span>
        </div>

        {/* XP Bar — resets each level */}
        <div className="xp-section">
          <div className="xp-header">
            <span className="xp-text">
              {isMaxLevel ? '⚡ MAX LEVEL' : `LV.${level} → LV.${level + 1}`}
            </span>
            <span className="xp-numbers">
              {isMaxLevel
                ? 'MAX XP'
                : `${xpInLevel.toLocaleString()} / ${xpNeeded.toLocaleString()}`
              }
            </span>
          </div>
          <div className="progress-bar-wrap xp-bar">
            <div
              className={`progress-bar-fill xp-fill ${isMaxLevel ? 'xp-maxed' : ''}`}
              style={{ width: `${barPercent}%` }}
            />
          </div>
          <div className="xp-footer">
            <span className="xp-subtext">LV.{level}</span>
            <span className="xp-subtext">
              {isMaxLevel
                ? '🏆 MAX LEVEL REACHED'
                : `${(xpNeeded - xpInLevel).toLocaleString()} XP to LV.${level + 1}`
              }
            </span>
          </div>
        </div>

        <div className="hero-socials">
          {socials.map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="social-btn">
              <span>{s.icon}</span>
              <span>{s.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

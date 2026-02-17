import React, { useState, useEffect } from 'react';
import { SKILL_TREES } from '../data/character';
import { sounds } from '../utils/sounds';
import './SkillTree.css';

export default function SkillTree({ addNotification, awardXP, masteredSkills, setMasteredSkills }) {
  const [activeTree, setActiveTree] = useState('backend');
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, [activeTree]);

  const handleTreeChange = (id) => {
    sounds.click();
    setAnimated(false);
    setActiveTree(id);
    setTimeout(() => setAnimated(true), 50);
  };

  const handleSkillClick = (skill, treeColor) => {
    if (masteredSkills.includes(skill.name)) {
      sounds.locked();
      addNotification(`Already studied ${skill.name}!`, '#666699');
      return;
    }
    setMasteredSkills(prev => [...prev, skill.name]);
    awardXP(50);
    sounds.achievement();
    addNotification(`+50 XP — Studied ${skill.name}! 📚`, treeColor);
  };

  const getSkillTier = (level) => {
    if (level >= 90) return { label: 'MASTER',     stars: '★★★★★' };
    if (level >= 80) return { label: 'EXPERT',     stars: '★★★★☆' };
    if (level >= 70) return { label: 'ADEPT',      stars: '★★★☆☆' };
    return               { label: 'APPRENTICE', stars: '★★☆☆☆' };
  };

  const currentTree = SKILL_TREES.find(t => t.id === activeTree);
  const totalXP = currentTree.skills.reduce((acc, s) => acc + s.xp, 0);

  return (
    <div className="skill-tree">
      <div className="tree-selector">
        {SKILL_TREES.map(tree => (
          <button
            key={tree.id}
            className={`tree-tab ${activeTree === tree.id ? 'active' : ''}`}
            style={{ '--tree-color': tree.color }}
            onClick={() => handleTreeChange(tree.id)}
          >
            <span className="tree-icon">{tree.icon}</span>
            <span className="tree-name">{tree.name}</span>
          </button>
        ))}
      </div>

      <div className="card tree-header-card" style={{ borderColor: currentTree.color + '44' }}>
        <div className="tree-header-top">
          <div>
            <h2 className="tree-title" style={{ color: currentTree.color }}>{currentTree.icon} {currentTree.name}</h2>
            <p className="tree-xp" style={{ color: currentTree.color }}>
              Tree XP: {totalXP.toLocaleString()} | {currentTree.skills.length} skills
            </p>
          </div>
          <div className="tree-mastery">
            <span className="mastery-label">MASTERY</span>
            <div className="mastery-stars">
              {'★'.repeat(Math.ceil(currentTree.skills.reduce((a, s) => a + s.level, 0) / currentTree.skills.length / 20))}
            </div>
          </div>
        </div>
        <p className="tree-hint">Click any skill to study it and earn XP (once per skill)</p>
      </div>

      <div className="skills-grid">
        {currentTree.skills.map((skill, i) => {
          const tier      = getSkillTier(skill.level);
          const isStudied = masteredSkills.includes(skill.name);
          return (
            <div
              key={skill.name}
              className={`skill-card ${isStudied ? 'studied' : ''}`}
              style={{ '--skill-color': currentTree.color, animationDelay: animated ? `${i * 0.06}s` : '0s' }}
              onClick={() => handleSkillClick(skill, currentTree.color)}
            >
              <div className="skill-card-top">
                <span className="skill-name">{skill.name}</span>
                {isStudied && <span className="studied-badge">✓ STUDIED</span>}
              </div>
              <div className="skill-tier-label" style={{ color: currentTree.color }}>{tier.label}</div>
              <div className="progress-bar-wrap skill-progress">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: animated ? `${skill.level}%` : '0%',
                    background: `linear-gradient(90deg, ${currentTree.color}55, ${currentTree.color})`,
                    boxShadow: `0 0 6px ${currentTree.color}`,
                    transitionDelay: `${i * 0.06}s`
                  }}
                />
              </div>
              <div className="skill-bottom">
                <span className="skill-stars" style={{ color: currentTree.color }}>{tier.stars}</span>
                <span className="skill-level" style={{ color: currentTree.color }}>LV.{skill.level}</span>
              </div>
              <div className="skill-xp-badge">{skill.xp.toLocaleString()} XP</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

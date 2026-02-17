import React, { useState } from 'react';
import { PROJECTS } from '../data/character';
import { sounds } from '../utils/sounds';
import './QuestLog.css';

const DIFF_COLORS = {
  'LEGENDARY': '#ff2d78',
  'EPIC': '#7b2fff',
  'RARE': '#00f5ff',
  'UNCOMMON': '#00ff88',
};

export default function QuestLog({ addNotification, awardXP, acceptedQuests, setAcceptedQuests, expandedOnce, setExpandedOnce }) {
  const [expandedQuest, setExpandedQuest] = useState(null);

  const acceptQuest = (project, e) => {
    e.stopPropagation();
    if (acceptedQuests.includes(project.id)) return;
    setAcceptedQuests(prev => [...prev, project.id]);
    awardXP(project.xpReward);
    sounds.questAccept();
    addNotification(`⚔️ Quest accepted! +${project.xpReward.toLocaleString()} XP`, project.color);
  };

  const toggleExpand = (id) => {
    setExpandedQuest(prev => prev === id ? null : id);
    // Award XP only the first time a quest is expanded
    if (!expandedOnce.includes(id)) {
      setExpandedOnce(prev => [...prev, id]);
      awardXP(10);
      sounds.xpGain();
      addNotification('+10 XP — Quest inspected!', '#666699');
    } else {
      sounds.click();
    }
  };

  const totalXP = PROJECTS.reduce((a, p) => a + p.xpReward, 0);
  const earnedXP = PROJECTS.filter(p => acceptedQuests.includes(p.id)).reduce((a, p) => a + p.xpReward, 0);

  return (
    <div className="quest-log">
      <div className="card quest-header-card">
        <div className="quest-stats-row">
          <div className="quest-stat">
            <span className="qs-val">{PROJECTS.length}</span>
            <span className="qs-label">TOTAL QUESTS</span>
          </div>
          <div className="quest-stat">
            <span className="qs-val" style={{ color: 'var(--neon-green)' }}>{acceptedQuests.length}</span>
            <span className="qs-label">ACCEPTED</span>
          </div>
          <div className="quest-stat">
            <span className="qs-val" style={{ color: 'var(--neon-cyan)' }}>{earnedXP.toLocaleString()}</span>
            <span className="qs-label">XP EARNED</span>
          </div>
          <div className="quest-stat">
            <span className="qs-val" style={{ color: 'var(--neon-purple)' }}>{totalXP.toLocaleString()}</span>
            <span className="qs-label">TOTAL AVAILABLE</span>
          </div>
        </div>
      </div>

      <div className="quest-list">
        {PROJECTS.map(project => {
          const isAccepted = acceptedQuests.includes(project.id);
          const isExpanded = expandedQuest === project.id;
          const diffColor = DIFF_COLORS[project.difficulty] || '#ffffff';

          return (
            <div
              key={project.id}
              className={`quest-card ${isAccepted ? 'accepted' : ''} ${isExpanded ? 'expanded' : ''}`}
              style={{ '--quest-color': project.color }}
              onClick={() => toggleExpand(project.id)}
            >
              <div className="quest-ribbon" style={{ background: diffColor, color: '#000' }}>
                {project.difficulty}
              </div>

              <div className="quest-main">
                <div className="quest-left">
                  <div className="quest-type" style={{ color: project.color }}>{project.type}</div>
                  <div className="quest-name">{project.name}</div>
                  <div className="quest-xp">⚡ {project.xpReward.toLocaleString()} XP REWARD</div>
                </div>
                <div className="quest-right">
                  {isAccepted ? (
                    <div className="accepted-badge">✓ ACCEPTED</div>
                  ) : (
                    <button
                      className="accept-btn"
                      style={{ borderColor: project.color, color: project.color }}
                      onClick={(e) => acceptQuest(project, e)}
                    >
                      ACCEPT QUEST
                    </button>
                  )}
                  <span className="expand-arrow">{isExpanded ? '▲' : '▼'}</span>
                </div>
              </div>

              {isExpanded && (
                <div className="quest-expanded">
                  <p className="quest-desc">{project.desc}</p>
                  <div className="quest-stack">
                    <span className="stack-label">TOOLS USED:</span>
                    <div className="stack-tags">
                      {project.stack.map(tech => (
                        <span key={tech} className="stack-tag" style={{ borderColor: project.color + '66', color: project.color }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

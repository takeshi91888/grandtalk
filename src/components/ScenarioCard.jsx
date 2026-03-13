/**
 * 场景选择卡片
 */
const difficultyStars = (level) => '⭐'.repeat(level);

function ScenarioCard({ scenario, onClick }) {
  return (
    <div
      className="scenario-card"
      onClick={() => onClick(scenario.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(scenario.id)}
      aria-label={`选择场景：${scenario.name}`}
    >
      <div style={{ fontSize: 52 }}>{scenario.emoji}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#3D2C2E' }}>
        {scenario.name}
      </div>
      <div style={{ fontSize: 18, color: '#795548', lineHeight: 1.4 }}>
        {scenario.description}
      </div>
      <div style={{ fontSize: 20, marginTop: 4 }}>
        {difficultyStars(scenario.difficulty)}
      </div>
    </div>
  );
}

export default ScenarioCard;

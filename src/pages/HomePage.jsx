import { useMemo } from 'react';
import ScenarioCard from '../components/ScenarioCard.jsx';
import { getRandomGreeting } from '../utils/greetings.js';

const scenarioList = [
  {
    id: 'morning',
    emoji: '☀️',
    name: '早安问候',
    description: '早上起床和孙女说早安',
    difficulty: 1,
  },
  {
    id: 'dinner',
    emoji: '🍽️',
    name: '一起吃饭',
    description: '晚餐时间和孙子聊天',
    difficulty: 2,
  },
  {
    id: 'drawing',
    emoji: '🎨',
    name: '看孩子画画',
    description: '孙女画了画想给您看',
    difficulty: 2,
  },
  {
    id: 'afterschool',
    emoji: '🎒',
    name: '放学回家',
    description: '孙子放学分享学校的事',
    difficulty: 3,
  },
  {
    id: 'park',
    emoji: '🌳',
    name: '周末公园',
    description: '带孩子们去公园玩',
    difficulty: 3,
  },
  {
    id: 'bedtime',
    emoji: '🌙',
    name: '睡前故事',
    description: '睡前的温馨时光',
    difficulty: 2,
  },
];

function HomePage({ onSelectScenario }) {
  const greeting = useMemo(() => getRandomGreeting(), []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FFF8F0',
      padding: '0 0 40px',
    }}>
      {/* 顶部标题区 */}
      <div style={{
        background: 'linear-gradient(135deg, #FF7043, #FF8A65)',
        padding: '36px 24px 32px',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(255,112,67,0.2)',
      }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🌟</div>
        <h1 style={{
          fontSize: 36,
          fontWeight: 800,
          color: 'white',
          margin: 0,
          textShadow: '0 1px 4px rgba(0,0,0,0.15)',
        }}>
          亲孙通
        </h1>
        <p style={{
          fontSize: 18,
          color: 'rgba(255,255,255,0.9)',
          margin: '6px 0 0',
          fontWeight: 400,
        }}>
          和孙子孙女说英语，一点都不难！
        </p>
      </div>

      {/* 每日问候语 */}
      <div style={{
        margin: '24px 20px 0',
        padding: '18px 22px',
        background: 'white',
        borderRadius: 16,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        borderLeft: '4px solid #FF7043',
        fontSize: 22,
        color: '#5D4037',
        lineHeight: 1.6,
      }}>
        {greeting}
      </div>

      {/* 场景选择区域 */}
      <div style={{ padding: '24px 20px 0' }}>
        <h2 style={{
          fontSize: 26,
          fontWeight: 700,
          color: '#3D2C2E',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          📖 选一个练习场景
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 16,
        }}>
          {scenarioList.map(scenario => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onClick={onSelectScenario}
            />
          ))}
        </div>
      </div>

      {/* 底部说明 */}
      <div style={{
        margin: '32px 20px 0',
        padding: '18px 22px',
        background: '#E8F5E9',
        borderRadius: 14,
        fontSize: 19,
        color: '#2E7D32',
        lineHeight: 1.7,
      }}>
        <strong>💡 怎么用：</strong><br />
        选一个场景 → 在下面的输入框打字（或之后用语音）→ 和小朋友说英语！
      </div>
    </div>
  );
}

export default HomePage;

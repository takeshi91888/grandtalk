import { useState } from 'react';

/**
 * 对话气泡组件
 * - AI 消息：左侧暖色气泡，含中文翻译和关键词
 * - 用户消息：右侧蓝色气泡
 */
function ChatBubble({ message, showTranslationByDefault = false, onSpeak, speakingMsgId }) {
  const [showTranslation, setShowTranslation] = useState(showTranslationByDefault);
  const [showWords, setShowWords] = useState(false);

  const isAI = message.role === 'assistant';
  const { dialogue, learning } = message;
  const msgId = message.id || message._id;
  const isThisSpeaking = speakingMsgId === msgId;

  if (isAI) {
    return (
      <div className="flex items-start gap-3 mb-6">
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #FFB74D, #FF7043)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0, boxShadow: '0 2px 8px rgba(255,112,67,0.3)' }}>👧</div>
        <div style={{ flex: 1, maxWidth: '80%' }}>
          <div className="bubble-ai" style={{ fontSize: 24, lineHeight: 1.7 }}>
            <p className="english-text" style={{ margin: 0, fontSize: 24 }}>{dialogue}</p>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
            {onSpeak && (
              <button onClick={() => onSpeak(dialogue, msgId)}
                style={{ background: isThisSpeaking ? '#FFE0B2' : 'white', border: `1px solid ${isThisSpeaking ? '#FF7043' : '#FFB74D'}`, borderRadius: 20, padding: '6px 16px', fontSize: 17, cursor: 'pointer', color: isThisSpeaking ? '#E64A19' : '#BF360C', transition: 'all 0.15s', fontWeight: isThisSpeaking ? 600 : 400 }}>
                {isThisSpeaking ? '⏹ 停止朗读' : '🔊 朗读'}
              </button>
            )}
            <button onClick={() => setShowTranslation(!showTranslation)}
              style={{ background: showTranslation ? '#FFF0E0' : 'white', border: '1px solid #FFB74D', borderRadius: 20, padding: '6px 16px', fontSize: 17, cursor: 'pointer', color: '#BF360C', transition: 'all 0.15s' }}>
              {showTranslation ? '收起中文 ▲' : '看中文翻译 👀'}
            </button>
            {learning?.key_words?.length > 0 && (
              <button onClick={() => setShowWords(!showWords)}
                style={{ background: showWords ? '#FFF3E0' : 'white', border: '1px solid #FFB74D', borderRadius: 20, padding: '6px 16px', fontSize: 17, cursor: 'pointer', color: '#E65100', transition: 'all 0.15s' }}>
                {showWords ? '收起词汇 ▲' : `📚 学习词汇 (${learning.key_words.length})`}
              </button>
            )}
          </div>
          {showTranslation && learning?.translation && (
            <div style={{ marginTop: 10, padding: '14px 18px', background: '#FFF8F0', borderRadius: 12, fontSize: 20, color: '#5D4037', borderLeft: '3px solid #FFB74D' }}>
              🌏 {learning.translation}
            </div>
          )}
          {showWords && learning?.key_words?.length > 0 && (
            <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {learning.key_words.map((word, i) => (
                <div key={i} className="word-card">
                  <span style={{ fontSize: 13, color: '#888', fontFamily: 'Georgia' }}>{word.pinyin}</span>
                  <span className="english-text" style={{ fontSize: 20, fontWeight: 600 }}>{word.en}</span>
                  <span style={{ fontSize: 17, color: '#795548' }}>{word.zh}</span>
                </div>
              ))}
            </div>
          )}
          {learning?.encouragement && (
            <div className="encouragement-bar" style={{ marginTop: 12 }}>{learning.encouragement}</div>
          )}
          {learning?.echo_correction && <EchoCorrectionTip correction={learning.echo_correction} />}
          {learning?.repeat_challenge && <RepeatChallengeCard challenge={learning.repeat_challenge} />}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end mb-6">
      <div style={{ maxWidth: '75%' }}>
        <div className="bubble-user" style={{ fontSize: 22 }}>{dialogue}</div>
        <div style={{ textAlign: 'right', fontSize: 15, color: '#90A4AE', marginTop: 4 }}>您说的</div>
      </div>
    </div>
  );
}

function EchoCorrectionTip({ correction }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ marginTop: 10 }}>
      <button onClick={() => setExpanded(!expanded)}
        style={{ background: '#FFFDE7', border: '1px solid #FDD835', borderRadius: 20, padding: '5px 14px', fontSize: 17, cursor: 'pointer', color: '#F57F17' }}>
        💡 {expanded ? '收起小提示' : '有个小提示'}
      </button>
      {expanded && (
        <div className="correction-tip" style={{ marginTop: 8 }}>
          <div style={{ marginBottom: 8 }}><span style={{ color: '#888', fontSize: 17 }}>您说的：</span><span style={{ fontSize: 20 }}>"{correction.user_said}"</span></div>
          <div style={{ marginBottom: 8 }}><span style={{ color: '#888', fontSize: 17 }}>试试这样说：</span><span className="english-text" style={{ fontSize: 22, fontWeight: 600, color: '#2E7D32' }}>"{correction.model_phrase}" 🎯</span></div>
          {correction.tip_zh && <div style={{ fontSize: 18, color: '#795548' }}>💬 {correction.tip_zh}</div>}
        </div>
      )}
    </div>
  );
}

function RepeatChallengeCard({ challenge }) {
  return (
    <div style={{ marginTop: 12, background: 'linear-gradient(135deg, #E8F5E9, #F1F8E9)', border: '1px solid #A5D6A7', borderRadius: 14, padding: '16px 20px' }}>
      <div style={{ fontSize: 18, color: '#2E7D32', marginBottom: 8 }}>🌟 Lily 想教你一个新词！</div>
      <div className="english-text" style={{ fontSize: 28, fontWeight: 700, color: '#1B5E20' }}>{challenge.word}</div>
      <div style={{ fontSize: 17, color: '#558B2F', marginTop: 4 }}>{challenge.slow_split}</div>
      {challenge.phonetic && <div style={{ fontSize: 16, color: '#888', fontFamily: 'Georgia' }}>[{challenge.phonetic}]</div>}
      <div style={{ fontSize: 20, color: '#33691E', marginTop: 6 }}>{challenge.zh}</div>
    </div>
  );
}

export default ChatBubble;

import { useState, useEffect, useRef } from 'react';
import ChatBubble from '../components/ChatBubble.jsx';
import ThinkingIndicator from '../components/ThinkingIndicator.jsx';
import SuggestReply from '../components/SuggestReply.jsx';
import useChat from '../hooks/useChat.js';

const scenarioNames = {
  morning: '☀️ 早安问候',
  dinner: '🍽️ 一起吃饭',
  drawing: '🎨 看孩子画画',
  afterschool: '🎒 放学回家',
  park: '🌳 周末公园',
  bedtime: '🌙 睡前故事',
};

function ChatPage({ scenarioId, onBack }) {
  const [inputText, setInputText] = useState('');
  const { messages, isLoading, error, sendMessage, loadOpening } = useChat(scenarioId);
  const chatBottomRef = useRef(null);
  const inputRef = useRef(null);

  // 加载开场白
  useEffect(() => {
    loadOpening();
  }, [scenarioId]);

  // 自动滚动到底部
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (text) => {
    const toSend = text || inputText.trim();
    if (!toSend || isLoading) return;
    setInputText('');
    await sendMessage(toSend);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 获取最后一条 AI 消息的建议回复
  const lastAIMessage = [...messages].reverse().find(m => m.role === 'assistant');
  const suggestedReply = lastAIMessage?.learning?.suggested_reply;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#FFF8F0',
    }}>
      {/* 顶部导航栏 */}
      <div style={{
        background: 'white',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        flexShrink: 0,
      }}>
        <button
          onClick={onBack}
          className="btn-large btn-secondary"
          style={{
            padding: '10px 16px',
            fontSize: 20,
            minWidth: 80,
          }}
          aria-label="返回首页"
        >
          ← 返回
        </button>
        <div>
          <h2 style={{
            fontSize: 24,
            fontWeight: 700,
            margin: 0,
            color: '#3D2C2E',
          }}>
            {scenarioNames[scenarioId] || '练习对话'}
          </h2>
          <p style={{ fontSize: 16, color: '#888', margin: 0 }}>
            用英语和小朋友聊聊吧！
          </p>
        </div>
      </div>

      {/* 对话区域 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 20px 10px',
      }}>
        {messages.length === 0 && !isLoading && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#BDBDBD',
            fontSize: 20,
          }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>💬</div>
            场景加载中，请稍候...
          </div>
        )}

        {messages.map((message, index) => (
          <ChatBubble
            key={message.id || index}
            message={message}
            showTranslationByDefault={index === 0} // 第一条默认展开翻译
          />
        ))}

        {isLoading && <ThinkingIndicator />}

        {error && (
          <div style={{
            margin: '12px 0',
            padding: '16px 20px',
            background: '#FFF8E1',
            borderRadius: 12,
            fontSize: 20,
            color: '#F57F17',
            textAlign: 'center',
            border: '1px solid #FFE082',
          }}>
            😅 {error}
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* 建议回复 */}
      <SuggestReply
        suggestedReply={suggestedReply}
        onSend={handleSend}
        disabled={isLoading}
      />

      {/* 输入区域 */}
      <div style={{
        background: 'white',
        padding: '16px 16px 20px',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
        flexShrink: 0,
      }}>
        <div style={{
          fontSize: 17,
          color: '#BDBDBD',
          marginBottom: 10,
          textAlign: 'center',
        }}>
          📝 打字练习（第二阶段会加语音按钮）
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="在这里打字说英语，按回车发送..."
            disabled={isLoading}
            style={{
              flex: 1,
              fontSize: 22,
              padding: '14px 18px',
              borderRadius: 14,
              border: '2px solid #FFB74D',
              outline: 'none',
              resize: 'none',
              fontFamily: 'Georgia, serif',
              lineHeight: 1.5,
              background: inputText ? 'white' : '#FAFAFA',
              minHeight: 56,
              maxHeight: 120,
              transition: 'border-color 0.15s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#FF7043'}
            onBlur={(e) => e.target.style.borderColor = '#FFB74D'}
            rows={1}
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            className="btn-large btn-primary"
            style={{
              minWidth: 72,
              height: 56,
              fontSize: 26,
              opacity: (!inputText.trim() || isLoading) ? 0.5 : 1,
            }}
            aria-label="发送"
          >
            发送
          </button>
        </div>

        {/* 快捷短语提示 */}
        <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['Hello!', 'I love you!', 'Good morning!', 'Yes!', 'Thank you!'].map(phrase => (
            <button
              key={phrase}
              onClick={() => handleSend(phrase)}
              disabled={isLoading}
              style={{
                background: '#FFF8F0',
                border: '1px solid #FFCC80',
                borderRadius: 20,
                padding: '6px 14px',
                fontSize: 18,
                cursor: 'pointer',
                color: '#E65100',
                fontFamily: 'Georgia, serif',
              }}
            >
              {phrase}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;

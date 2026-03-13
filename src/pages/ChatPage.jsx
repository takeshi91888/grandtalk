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
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const { messages, isLoading, error, sendMessage, loadOpening } = useChat(scenarioId);
  const chatBottomRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const lastSpokenIndexRef = useRef(-1);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results).map(r => r[0].transcript).join('');
        setInputText(transcript);
        if (event.results[event.results.length - 1].isFinal) setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInputText('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speak = (text, msgId) => {
    if (!window.speechSynthesis) return;
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      if (speakingMsgId === msgId) { setSpeakingMsgId(null); return; }
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.78;
    utterance.pitch = 1.1;
    utterance.volume = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v =>
      v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Moira'))
    ) || voices.find(v => v.lang.startsWith('en'));
    if (enVoice) utterance.voice = enVoice;
    utterance.onstart = () => setSpeakingMsgId(msgId);
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!autoSpeak) return;
    const lastIndex = messages.length - 1;
    if (lastIndex < 0) return;
    const lastMsg = messages[lastIndex];
    if (lastMsg?.role === 'assistant' && lastMsg?.dialogue && lastIndex > lastSpokenIndexRef.current) {
      lastSpokenIndexRef.current = lastIndex;
      setTimeout(() => speak(lastMsg.dialogue, lastMsg.id || `msg-${lastIndex}`), 300);
    }
  }, [messages.length, autoSpeak]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (window.speechSynthesis?.speaking) window.speechSynthesis.cancel();
    setSpeakingMsgId(null);
    lastSpokenIndexRef.current = -1;
  }, [scenarioId]);

  useEffect(() => { loadOpening(); }, [scenarioId]);
  useEffect(() => { chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);

  const handleSend = async (text) => {
    const toSend = text || inputText.trim();
    if (!toSend || isLoading) return;
    setInputText('');
    await sendMessage(toSend);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const lastAIMessage = [...messages].reverse().find(m => m.role === 'assistant');
  const suggestedReply = lastAIMessage?.learning?.suggested_reply;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#FFF8F0' }}>
      <div style={{ background: 'white', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', flexShrink: 0 }}>
        <button onClick={onBack} className="btn-large btn-secondary" style={{ padding: '10px 16px', fontSize: 20, minWidth: 80 }} aria-label="返回首页">← 返回</button>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: '#3D2C2E' }}>{scenarioNames[scenarioId] || '练习对话'}</h2>
          <p style={{ fontSize: 16, color: '#888', margin: 0 }}>用英语和小朋友聊聊吧！</p>
        </div>
        {window.speechSynthesis && (
          <button
            onClick={() => {
              if (autoSpeak && window.speechSynthesis.speaking) { window.speechSynthesis.cancel(); setSpeakingMsgId(null); }
              setAutoSpeak(!autoSpeak);
            }}
            title={autoSpeak ? '点击关闭自动朗读' : '点击开启自动朗读'}
            style={{ background: autoSpeak ? '#FF7043' : '#F5F5F5', border: 'none', borderRadius: 24, padding: '8px 16px', fontSize: 17, cursor: 'pointer', color: autoSpeak ? 'white' : '#999', fontWeight: 600, flexShrink: 0, boxShadow: autoSpeak ? '0 2px 8px rgba(255,112,67,0.3)' : 'none', transition: 'all 0.2s' }}
          >
            {autoSpeak ? '🔊 自动朗读' : '🔇 已静音'}
          </button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 10px' }}>
        {messages.length === 0 && !isLoading && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#BDBDBD', fontSize: 20 }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>💬</div>
            场景加载中，请稍候...
          </div>
        )}
        {messages.map((message, index) => (
          <ChatBubble
            key={message.id || index}
            message={message}
            showTranslationByDefault={index === 0}
            onSpeak={window.speechSynthesis ? (text, msgId) => speak(text, msgId || message.id || `msg-${index}`) : null}
            speakingMsgId={speakingMsgId}
          />
        ))}
        {isLoading && <ThinkingIndicator />}
        {error && (
          <div style={{ margin: '12px 0', padding: '16px 20px', background: '#FFF8E1', borderRadius: 12, fontSize: 20, color: '#F57F17', textAlign: 'center', border: '1px solid #FFE082' }}>
            😅 {error}
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      <SuggestReply suggestedReply={suggestedReply} onSend={handleSend} disabled={isLoading} />

      <div style={{ background: 'white', padding: '16px 16px 20px', boxShadow: '0 -2px 12px rgba(0,0,0,0.06)', flexShrink: 0 }}>
        {isListening && (
          <div style={{ textAlign: 'center', marginBottom: 10, fontSize: 18, color: '#E53935', animation: 'pulse 1s infinite' }}>
            🔴 正在聆听，请说英语...
          </div>
        )}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          {speechSupported && (
            <button onClick={toggleVoice} disabled={isLoading} title={isListening ? '停止录音' : '按下说话'}
              style={{ width: 64, height: 64, borderRadius: '50%', border: 'none', background: isListening ? '#E53935' : '#FF7043', color: 'white', fontSize: 28, cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: isListening ? '0 0 0 6px rgba(229,57,53,0.3)' : '0 3px 10px rgba(255,112,67,0.4)', transition: 'all 0.2s', opacity: isLoading ? 0.5 : 1 }}
              aria-label={isListening ? '停止录音' : '语音输入'}>
              {isListening ? '⏹' : '🎤'}
            </button>
          )}
          <textarea ref={inputRef} value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={handleKeyDown}
            placeholder={speechSupported ? '按🎤说话，或在这里打字...' : '在这里打字说英语，按回车发送...'}
            disabled={isLoading || isListening}
            style={{ flex: 1, fontSize: 22, padding: '14px 18px', borderRadius: 14, border: `2px solid ${isListening ? '#E53935' : '#FFB74D'}`, outline: 'none', resize: 'none', fontFamily: 'Georgia, serif', lineHeight: 1.5, background: inputText ? 'white' : '#FAFAFA', minHeight: 64, maxHeight: 120, transition: 'border-color 0.15s' }}
            onFocus={(e) => e.target.style.borderColor = '#FF7043'}
            onBlur={(e) => { if (!isListening) e.target.style.borderColor = '#FFB74D'; }}
            rows={1}
          />
          <button onClick={() => handleSend()} disabled={!inputText.trim() || isLoading} className="btn-large btn-primary"
            style={{ minWidth: 72, height: 64, fontSize: 26, opacity: (!inputText.trim() || isLoading) ? 0.5 : 1 }}
            aria-label="发送">发送</button>
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['Hello!', 'I love you!', 'Good morning!', 'Yes!', 'Thank you!'].map(phrase => (
            <button key={phrase} onClick={() => handleSend(phrase)} disabled={isLoading}
              style={{ background: '#FFF8F0', border: '1px solid #FFCC80', borderRadius: 20, padding: '6px 14px', fontSize: 18, cursor: 'pointer', color: '#E65100', fontFamily: 'Georgia, serif' }}>
              {phrase}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;

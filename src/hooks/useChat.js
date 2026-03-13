import { useState, useCallback } from 'react';
import { parseAIResponse } from '../utils/parseAIResponse.js';

/**
 * 对话状态管理 Hook
 */
export function useChat(scenarioId = 'morning') {
  const [messages, setMessages] = useState([]); // { role, content, dialogue, learning, timestamp }
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 发送消息到后端
  const sendMessage = useCallback(async (userText) => {
    if (!userText.trim()) return;
    setError(null);

    // 添加用户消息
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: userText,
      dialogue: userText,
      learning: null,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // 构建发送给后端的历史（只保留最近10轮，节省token）
      const currentMessages = [...messages, userMessage];
      const historyForAPI = currentMessages
        .slice(-20) // 最多20条
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          scenario: scenarioId,
          history: historyForAPI.slice(0, -1), // 不重复发最后一条
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '网络请求失败');
      }

      const data = await response.json();
      const { dialogue, learning } = parseAIResponse(data.response);

      // 添加 AI 消息
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response,
        dialogue: dialogue,
        learning: learning,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      return aiMessage;

    } catch (err) {
      setError(err.message || '发生了一个错误，请重试');
      console.error('发送消息失败:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [messages, scenarioId]);

  // 加载场景开场白
  const loadOpening = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/chat/opening/${scenarioId}`);
      if (!response.ok) throw new Error('无法加载场景');

      const data = await response.json();
      const { dialogue, learning } = parseAIResponse(data.response);

      const openingMessage = {
        id: Date.now(),
        role: 'assistant',
        content: data.response,
        dialogue: dialogue,
        learning: learning,
        isOpening: true,
        timestamp: new Date(),
      };

      setMessages([openingMessage]);
      return openingMessage;
    } catch (err) {
      setError('加载场景失败，请检查网络连接');
      console.error('加载开场白失败:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [scenarioId]);

  // 清空对话
  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    loadOpening,
    clearChat,
  };
}

export default useChat;

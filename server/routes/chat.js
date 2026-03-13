import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { getSystemPrompt, scenarios } from '../prompts/scenarios.js';

const router = Router();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { message, scenario = 'morning', history = [] } = req.body;

    if (!message && history.length === 0) {
      return res.status(400).json({ error: '请发送消息内容' });
    }

    const systemPrompt = getSystemPrompt(scenario);

    // 构建对话历史
    const messages = [
      ...history,
      ...(message ? [{ role: 'user', content: message }] : []),
    ];

    if (messages.length === 0) {
      return res.status(400).json({ error: '消息不能为空' });
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      system: systemPrompt,
      messages: messages,
      temperature: 0.85,
    });

    const aiText = response.content[0].text;

    res.json({
      success: true,
      response: aiText,
      scenario: scenario,
    });
  } catch (error) {
    console.error('Claude API 错误:', error);

    if (error.status === 401) {
      return res.status(401).json({ error: 'API Key 无效，请检查 .env 配置' });
    }
    if (error.status === 429) {
      return res.status(429).json({ error: '请求太频繁，请稍后再试' });
    }

    res.status(500).json({ error: '小朋友正在思考，请稍等一下...' });
  }
});

// GET /api/chat/opening — 获取场景开场白
router.get('/opening/:scenarioId', async (req, res) => {
  const { scenarioId } = req.params;
  const scenario = scenarios[scenarioId];

  if (!scenario) {
    return res.status(404).json({ error: '场景不存在' });
  }

  // 开场白直接用预设的，不调用 API，省资源
  const openingText = scenario.openingLine;

  // 为开场白生成学习数据
  const learningData = {
    translation: getOpeningTranslation(scenarioId),
    key_words: getOpeningKeyWords(scenarioId),
    suggested_reply: getOpeningSuggestedReply(scenarioId),
    encouragement: '准备好了吗？让我们开始练习吧！💪',
    echo_correction: null,
    repeat_challenge: null,
  };

  res.json({
    success: true,
    response: openingText + '\n|||LEARNING|||\n' + JSON.stringify(learningData),
    scenario: scenarioId,
  });
});

function getOpeningTranslation(scenarioId) {
  const translations = {
    morning: '早上好，爷爷！您睡得好吗？',
    dinner: '今晚吃什么？我好饿啊！',
    drawing: '看！我画了一幅画！您喜欢吗？',
    afterschool: '嗨，奶奶！猜猜今天学校发生了什么！',
    park: '我们可以去公园吗？我想玩秋千！',
    bedtime: '奶奶，您能给我讲个故事吗？求求了！',
  };
  return translations[scenarioId] || '你好！';
}

function getOpeningKeyWords(scenarioId) {
  const words = {
    morning: [
      { en: 'good morning', zh: '早上好', pinyin: 'zǎo shang hǎo' },
      { en: 'sleep', zh: '睡觉', pinyin: 'shuì jiào' },
    ],
    dinner: [
      { en: 'hungry', zh: '饿', pinyin: 'è' },
      { en: 'dinner', zh: '晚餐', pinyin: 'wǎn cān' },
    ],
    drawing: [
      { en: 'drew', zh: '画了', pinyin: 'huà le' },
      { en: 'picture', zh: '画', pinyin: 'huà' },
    ],
    afterschool: [
      { en: 'school', zh: '学校', pinyin: 'xué xiào' },
      { en: 'today', zh: '今天', pinyin: 'jīn tiān' },
    ],
    park: [
      { en: 'park', zh: '公园', pinyin: 'gōng yuán' },
      { en: 'swings', zh: '秋千', pinyin: 'qiū qiān' },
    ],
    bedtime: [
      { en: 'story', zh: '故事', pinyin: 'gù shì' },
      { en: 'please', zh: '请', pinyin: 'qǐng' },
    ],
  };
  return words[scenarioId] || [];
}

function getOpeningSuggestedReply(scenarioId) {
  const replies = {
    morning: { en: 'Good morning, Lily!', zh: '早上好，Lily！', pinyin: 'Good morning, Lily!' },
    dinner: { en: "Let's eat rice!", zh: '我们吃米饭吧！', pinyin: "Let's eat rice!" },
    drawing: { en: 'Beautiful! I love it!', zh: '真漂亮！我喜欢！', pinyin: 'Beautiful! I love it!' },
    afterschool: { en: "Welcome home! How was school?", zh: '欢迎回家！学校怎么样？', pinyin: 'Welcome home! How was school?' },
    park: { en: "Yes! Let's go to the park!", zh: '好的！我们去公园吧！', pinyin: "Yes! Let's go to the park!" },
    bedtime: { en: 'Of course! Come here!', zh: '当然可以！过来吧！', pinyin: 'Of course! Come here!' },
  };
  return replies[scenarioId] || { en: 'Hello!', zh: '你好！', pinyin: 'Hello!' };
}

export default router;

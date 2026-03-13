/**
 * 解析 Claude 响应中的对话正文和学习数据
 * 格式：对话正文 |||LEARNING||| { JSON }
 */
export function parseAIResponse(text) {
  if (!text) return { dialogue: '', learning: null };

  const parts = text.split('|||LEARNING|||');
  const dialogue = parts[0].trim();
  let learning = null;

  if (parts[1]) {
    try {
      // 清理可能的多余字符
      const jsonStr = parts[1].trim();
      learning = JSON.parse(jsonStr);
    } catch (e) {
      console.warn('LEARNING 数据解析失败:', e);
      // 尝试提取 JSON 块
      try {
        const match = parts[1].match(/\{[\s\S]*\}/);
        if (match) {
          learning = JSON.parse(match[0]);
        }
      } catch (e2) {
        console.warn('备用解析也失败:', e2);
      }
    }
  }

  return { dialogue, learning };
}

export default parseAIResponse;

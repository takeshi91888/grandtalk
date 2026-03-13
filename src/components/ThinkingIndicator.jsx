/**
 * AI 思考中的动画指示器
 */
function ThinkingIndicator() {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div style={{
        width: 52,
        height: 52,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #FFB74D, #FF7043)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 26,
        flexShrink: 0,
      }}>
        👧
      </div>
      <div className="bubble-ai" style={{ padding: '18px 24px' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="thinking-dot"></span>
          <span className="thinking-dot"></span>
          <span className="thinking-dot"></span>
          <span style={{ fontSize: 18, color: '#8D6E63', marginLeft: 4 }}>
            正在想...
          </span>
        </div>
      </div>
    </div>
  );
}

export default ThinkingIndicator;

import { useState } from 'react';

/**
 * "不知道怎么说？试试这句" 建议回复组件
 */
function SuggestReply({ suggestedReply, onSend, disabled }) {
  const [expanded, setExpanded] = useState(false);

  if (!suggestedReply) return null;

  return (
    <div style={{ padding: '0 16px 16px' }}>
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          style={{
            width: '100%',
            background: '#FFFDE7',
            border: '1px dashed #F9A825',
            borderRadius: 14,
            padding: '14px 20px',
            fontSize: 20,
            cursor: 'pointer',
            color: '#F57F17',
            textAlign: 'center',
            transition: 'all 0.15s',
          }}
        >
          💡 不知道怎么回答？点这里
        </button>
      ) : (
        <div className="suggest-card">
          <div style={{ marginBottom: 4 }}>
            <div style={{ fontSize: 17, color: '#888', marginBottom: 6 }}>
              试试说这句话：
            </div>
            <div className="english-text" style={{
              fontSize: 26,
              fontWeight: 700,
              color: '#1A237E',
              marginBottom: 6,
            }}>
              "{suggestedReply.en}"
            </div>
            <div style={{ fontSize: 20, color: '#5D4037', marginBottom: 4 }}>
              意思：{suggestedReply.zh}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
            <button
              className="btn-large btn-primary"
              style={{ flex: 1, fontSize: 20 }}
              onClick={() => {
                onSend(suggestedReply.en);
                setExpanded(false);
              }}
              disabled={disabled}
            >
              📤 直接发送
            </button>
            <button
              className="btn-large btn-secondary"
              style={{ minWidth: 48, fontSize: 22 }}
              onClick={() => setExpanded(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuggestReply;

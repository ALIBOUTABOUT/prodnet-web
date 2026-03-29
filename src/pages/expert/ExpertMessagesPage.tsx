import React, { useState, useEffect, useRef } from 'react';
import { useExpert, ExpertConversation } from '@/contexts/ExpertContext';
import {
  MessageCircle, SendHorizontal, ArrowLeft, Search, Users,
} from 'lucide-react';

export function ExpertMessagesPage() {
  const { conversations, getMessagesForConversation, sendMessage, markConversationRead } = useExpert();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [searchQ, setSearchQ] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  const filtered = conversations.filter((c) =>
    c.participantName.toLowerCase().includes(searchQ.toLowerCase()) ||
    c.projectTitle?.toLowerCase().includes(searchQ.toLowerCase()),
  );

  const selected = conversations.find((c) => c.id === selectedId);
  const msgs = selectedId ? getMessagesForConversation(selectedId) : [];

  useEffect(() => {
    if (selectedId) {
      markConversationRead(selectedId);
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedId, msgs.length]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || !selectedId) return;
    sendMessage(selectedId, trimmed);
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const fmtTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffH = (now.getTime() - d.getTime()) / 3600000;
    if (diffH < 24) return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    if (diffH < 168) return d.toLocaleDateString('en-US', { weekday: 'short' });
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const roleBadge = (role: string) => {
    const styles: Record<string, { bg: string; color: string }> = {
      investor: { bg: '#eff6ff', color: '#3b82f6' },
      farmer: { bg: '#ecfdf5', color: '#10b981' },
      expert: { bg: '#f5f3ff', color: '#8b5cf6' },
    };
    const s = styles[role] || styles.expert;
    return <span style={{ ...S.roleBadge, backgroundColor: s.bg, color: s.color }}>{role}</span>;
  };

  return (
    <div style={S.page}>
      <div style={S.container}>
        {/* Sidebar */}
        <aside style={{ ...S.sidebar, ...(selectedId ? { display: undefined } : {}) }}>
          <div style={S.sideHead}>
            <h2 style={S.sideTitle}>Messages</h2>
          </div>

          <div style={S.searchWrap}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input
              type="text"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search conversations..."
              style={S.searchInput}
            />
          </div>

          <div style={S.convList}>
            {filtered.length === 0 ? (
              <div style={S.emptyConv}>
                <Users size={24} color="#94a3b8" />
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.8125rem' }}>No conversations found</p>
              </div>
            ) : (
              filtered.map((c) => (
                <ConvItem key={c.id} conv={c} active={c.id === selectedId}
                  onClick={() => setSelectedId(c.id)} roleBadge={roleBadge} fmtTime={fmtTime} />
              ))
            )}
          </div>
        </aside>

        {/* Chat */}
        <main style={S.chat}>
          {!selected ? (
            <div style={S.emptyChat}>
              <div style={S.emptyChatIc}><MessageCircle size={32} color="#94a3b8" /></div>
              <h3 style={{ margin: '0 0 0.25rem', color: '#334155', fontWeight: 700 }}>Select a conversation</h3>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
                Choose a conversation from the left to start messaging.
              </p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div style={S.chatHead}>
                <button onClick={() => setSelectedId(null)} style={S.mobileBack}><ArrowLeft size={18} /></button>
                <div style={S.chatHeadAv}>{selected.participantName.charAt(0)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={S.chatName}>{selected.participantName}</p>
                  <p style={S.chatSub}>{selected.projectTitle || selected.participantRole}</p>
                </div>
                {roleBadge(selected.participantRole)}
              </div>

              {/* Messages */}
              <div style={S.msgArea}>
                {msgs.map((m) => {
                  const isMe = m.senderName !== selected.participantName;
                  return (
                    <div key={m.id} style={{ ...S.msgRow, justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                      <div style={{ ...S.bubble, ...(isMe ? S.bubbleMe : S.bubbleThem) }}>
                        <p style={S.msgText}>{m.text}</p>
                        <span style={{ ...S.msgTime, color: isMe ? 'rgba(255,255,255,0.6)' : '#94a3b8' }}>
                          {fmtTime(m.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={endRef} />
              </div>

              {/* Input */}
              <div style={S.inputBar}>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  rows={1}
                  style={S.textInput}
                />
                <button onClick={handleSend} disabled={!text.trim()} style={{ ...S.sendBtn, opacity: text.trim() ? 1 : 0.5 }}>
                  <SendHorizontal size={18} />
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function ConvItem({ conv, active, onClick, roleBadge, fmtTime }: {
  conv: ExpertConversation; active: boolean;
  onClick: () => void;
  roleBadge: (r: string) => React.ReactNode;
  fmtTime: (iso: string) => string;
}) {
  return (
    <button onClick={onClick} style={{ ...S.convItem, ...(active ? S.convItemActive : {}) }}>
      <div style={S.convAv}>{conv.participantName.charAt(0)}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '2px' }}>
          <span style={S.convName}>{conv.participantName}</span>
          {roleBadge(conv.participantRole)}
        </div>
        <p style={S.convLast}>{conv.lastMessage}</p>
      </div>
      <div style={S.convMeta}>
        <span style={S.convTime}>{fmtTime(conv.lastMessageAt)}</span>
        {conv.unreadCount > 0 && <span style={S.unread}>{conv.unreadCount}</span>}
      </div>
    </button>
  );
}

const card: React.CSSProperties = {
  backgroundColor: '#ffffff', borderRadius: '14px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)',
  border: '1px solid #e2e8f0',
};

const S: Record<string, React.CSSProperties> = {
  page: { minHeight: 'calc(100vh - 60px)', backgroundColor: '#f8fafc', padding: '1.25rem' },
  container: { maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '340px 1fr', height: 'calc(100vh - 100px)', ...card, overflow: 'hidden' },

  sidebar: { borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  sideHead: { padding: '1.25rem 1.25rem 0.75rem' },
  sideTitle: { margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' },
  searchWrap: { position: 'relative', padding: '0 1rem 0.75rem' },
  searchInput: {
    width: '100%', padding: '0.5rem 0.75rem 0.5rem 2.25rem', border: '1.5px solid #e2e8f0',
    borderRadius: '10px', fontSize: '0.8125rem', fontFamily: 'inherit',
    backgroundColor: '#f8fafc', color: '#0f172a', outline: 'none', boxSizing: 'border-box',
  } as React.CSSProperties,

  convList: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
  convItem: {
    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1.25rem',
    border: 'none', borderBottom: '1px solid #f1f5f9', backgroundColor: 'transparent',
    cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', width: '100%',
  } as React.CSSProperties,
  convItemActive: { backgroundColor: '#f1f5f9' },
  convAv: {
    width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
    background: 'linear-gradient(135deg, #1e3a5f, #0f172a)', color: '#ffffff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.125rem', fontWeight: 700,
  },
  convName: { fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } as React.CSSProperties,
  convLast: { margin: 0, fontSize: '0.8125rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } as React.CSSProperties,
  convMeta: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 },
  convTime: { fontSize: '0.6875rem', color: '#94a3b8', fontWeight: 500 },
  unread: {
    minWidth: '18px', height: '18px', borderRadius: '9px', padding: '0 5px',
    background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#ffffff',
    fontSize: '0.6875rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  emptyConv: { padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' },
  roleBadge: { padding: '2px 8px', borderRadius: '4px', fontSize: '0.625rem', fontWeight: 700, textTransform: 'capitalize' } as React.CSSProperties,

  chat: { display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  emptyChat: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' },
  emptyChatIc: { width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' },

  chatHead: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1.25rem', borderBottom: '1px solid #e2e8f0' },
  mobileBack: {
    display: 'none', border: 'none', backgroundColor: 'transparent',
    cursor: 'pointer', padding: '4px', color: '#475569',
  },
  chatHeadAv: {
    width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
    background: 'linear-gradient(135deg, #1e3a5f, #0f172a)', color: '#ffffff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1rem', fontWeight: 700,
  },
  chatName: { margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' },
  chatSub: { margin: 0, fontSize: '0.8125rem', color: '#64748b' },

  msgArea: { flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  msgRow: { display: 'flex' },
  bubble: { maxWidth: '65%', padding: '0.625rem 0.875rem', borderRadius: '14px' },
  bubbleMe: { background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#ffffff', borderBottomRightRadius: '4px' },
  bubbleThem: { backgroundColor: '#f1f5f9', color: '#0f172a', borderBottomLeftRadius: '4px' },
  msgText: { margin: 0, fontSize: '0.875rem', lineHeight: 1.5 },
  msgTime: { display: 'block', fontSize: '0.6875rem', marginTop: '2px', textAlign: 'right' } as React.CSSProperties,

  inputBar: { display: 'flex', alignItems: 'flex-end', gap: '0.5rem', padding: '0.75rem 1.25rem', borderTop: '1px solid #e2e8f0' },
  textInput: {
    flex: 1, padding: '0.625rem 0.875rem', border: '1.5px solid #e2e8f0',
    borderRadius: '12px', fontSize: '0.875rem', fontFamily: 'inherit',
    resize: 'none', outline: 'none', color: '#0f172a', backgroundColor: '#f8fafc',
    lineHeight: 1.4,
  } as React.CSSProperties,
  sendBtn: {
    width: '40px', height: '40px', borderRadius: '12px', border: 'none',
    background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#ffffff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
  },
};

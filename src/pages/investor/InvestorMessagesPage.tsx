/**
 * InvestorMessagesPage — two-panel chat interface.
 * Left: list of conversations (expressed interests)
 * Right: active chat with mock replies
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMessages, ConversationEntry } from '@/contexts/MessagesContext';
import { formatBudget } from '@/models/project';
import { MessageCircle, Send, ArrowLeft, Heart, CheckCheck, Trash2 } from 'lucide-react';

export function InvestorMessagesPage() {
  const { conversations, sendMessage, markRead, withdrawInterest } = useMessages();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeId, setActiveId] = useState<string | null>(
    searchParams.get('project') ?? (conversations[0]?.projectId || null)
  );
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Sync activeId when URL ?project= param changes (e.g. navigating between projects)
  useEffect(() => {
    const paramId = searchParams.get('project');
    if (paramId) setActiveId(paramId);
  }, [searchParams]);

  const activeConvo: ConversationEntry | undefined = conversations.find(
    (c) => c.projectId === activeId
  );

  // Mark as read when switching
  useEffect(() => {
    if (activeId) markRead(activeId);
  }, [activeId, markRead]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConvo?.messages.length]);

  // Auto-select first conversation (or deselect if active was withdrawn)
  useEffect(() => {
    if (!activeId && conversations.length > 0) {
      setActiveId(conversations[0].projectId);
    } else if (activeId && !conversations.find((c) => c.projectId === activeId)) {
      setActiveId(conversations[0]?.projectId ?? null);
    }
  }, [conversations, activeId]);

  const handleSelect = (projectId: string) => {
    setActiveId(projectId);
    setSearchParams({ project: projectId });
  };

  const handleSend = () => {
    const text = draft.trim();
    if (!text || !activeId) return;
    sendMessage(activeId, text);
    setDraft('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (conversations.length === 0) {
    return (
      <div style={styles.emptyPage}>
        <MessageCircle size={56} style={{ color: '#DEE2E6', marginBottom: '1rem' }} />
        <h2 style={{ margin: '0 0 0.5rem', color: '#212529', fontSize: '1.25rem' }}>No messages yet</h2>
        <p style={{ margin: '0 0 1.5rem', color: '#6C757D', fontSize: '0.9375rem' }}>
          Express interest in a project to start a conversation.
        </p>
        <button onClick={() => navigate('/investor')} style={styles.browseBtn}>
          <Heart size={16} />
          Browse Projects
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* ── Conversation List (left panel) ── */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.sidebarTitle}>Messages</h2>
          <span style={styles.convoCount}>{conversations.length}</span>
        </div>

        <div style={styles.convoList}>
          {conversations.map((c) => (
            <button
              key={c.projectId}
              onClick={() => handleSelect(c.projectId)}
              style={{
                ...styles.convoItem,
                backgroundColor: activeId === c.projectId ? '#F0FFF4' : '#FFFFFF',
                borderLeft: activeId === c.projectId ? '3px solid #2ECC71' : '3px solid transparent',
              }}
            >
              <div style={styles.convoAvatar}>
                {c.imageUrl ? (
                  <img
                    src={c.imageUrl}
                    alt={c.projectTitle}
                    style={styles.convoAvatarImg}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <MessageCircle size={20} style={{ color: '#2ECC71' }} />
                )}
              </div>
              <div style={styles.convoInfo}>
                <div style={styles.convoTitleRow}>
                  <span style={styles.convoTitle}>{c.projectTitle}</span>
                  <span style={styles.convoTime}>
                    {formatTime(c.messages[c.messages.length - 1]?.timestamp ?? c.expressedAt)}
                  </span>
                </div>
                <div style={styles.convoPreview}>
                  {(() => {
                    const last = c.messages[c.messages.length - 1];
                    if (!last) return c.region;
                    const raw = (last.from === 'investor' ? 'You: ' : '') + last.text;
                    return raw.length > 52 ? raw.slice(0, 52) + '\u2026' : raw;
                  })()}
                </div>
                {c.unread > 0 && (
                  <div style={{ textAlign: 'right', marginTop: '2px' }}>
                    <span style={styles.unreadBadge}>{c.unread}</span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Chat Panel (right panel) ── */}
      <div style={styles.chatPanel}>
        {activeConvo ? (
          <>
            {/* Chat header */}
            <div style={styles.chatHeader}>
              <button
                onClick={() => navigate(`/investor/project/${activeConvo.projectId}`)}
                style={styles.chatHeaderBack}
                title="View project"
              >
                <ArrowLeft size={18} />
              </button>
              <div style={styles.chatHeaderAvatar}>
                {activeConvo.imageUrl ? (
                  <img
                    src={activeConvo.imageUrl}
                    alt={activeConvo.projectTitle}
                    style={styles.chatHeaderAvatarImg}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <MessageCircle size={20} style={{ color: '#2ECC71' }} />
                )}
              </div>
              <div>
                <div style={styles.chatHeaderTitle}>{activeConvo.projectTitle}</div>
                <div style={styles.chatHeaderSub}>
                  {activeConvo.region} · {formatBudget(activeConvo.budget)}
                </div>
              </div>
              <button
                onClick={() => withdrawInterest(activeConvo.projectId)}
                style={{ ...styles.chatHeaderBack, marginLeft: 'auto', color: '#E74C3C' }}
                title="Withdraw interest"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Messages */}
            <div style={styles.messages}>
              <div style={styles.interestNotice}>
                <Heart size={14} style={{ color: '#2ECC71' }} />
                You expressed interest on {formatDate(activeConvo.expressedAt)}
              </div>

              {activeConvo.messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    ...styles.msgRow,
                    justifyContent: msg.from === 'investor' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      ...styles.bubble,
                      backgroundColor: msg.from === 'investor' ? '#2ECC71' : '#F1F3F5',
                      color: msg.from === 'investor' ? '#FFFFFF' : '#212529',
                      borderBottomRightRadius: msg.from === 'investor' ? '4px' : '18px',
                      borderBottomLeftRadius: msg.from === 'owner' ? '4px' : '18px',
                    }}
                  >
                    <p style={styles.bubbleText}>{msg.text}</p>
                    <span
                      style={{
                        ...styles.bubbleTime,
                        color: msg.from === 'investor' ? 'rgba(255,255,255,0.7)' : '#ADB5BD',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '3px',
                      }}
                    >
                      {formatTime(msg.timestamp)}
                      {msg.from === 'investor' && (
                        <CheckCheck
                          size={12}
                          style={{ color: msg.read ? '#FFFFFF' : 'rgba(255,255,255,0.45)' }}
                        />
                      )}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={styles.inputBar}>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message… (Enter to send)"
                style={styles.input}
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={!draft.trim()}
                style={{
                  ...styles.sendBtn,
                  backgroundColor: draft.trim() ? '#2ECC71' : '#DEE2E6',
                  cursor: draft.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                <Send size={18} style={{ color: draft.trim() ? '#FFFFFF' : '#ADB5BD' }} />
              </button>
            </div>
          </>
        ) : (
          <div style={styles.noSelection}>
            <MessageCircle size={48} style={{ color: '#DEE2E6' }} />
            <p>Select a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    height: 'calc(100vh - 64px)',
    backgroundColor: '#F8F9FA',
    overflow: 'hidden',
  },

  /* ──── Empty state ──── */
  emptyPage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 64px)',
    padding: '2rem',
    textAlign: 'center',
  },
  browseBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '0.5rem',
    backgroundColor: '#2ECC71',
    color: '#FFFFFF',
    fontSize: '0.9375rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },

  /* ──── Sidebar ──── */
  sidebar: {
    width: '320px',
    flexShrink: 0,
    backgroundColor: '#FFFFFF',
    borderRight: '1px solid #E9ECEF',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1.25rem 1.25rem 1rem',
    borderBottom: '1px solid #F1F3F5',
  },
  sidebarTitle: {
    margin: 0,
    fontSize: '1.125rem',
    fontWeight: 700,
    color: '#212529',
  },
  convoCount: {
    padding: '2px 8px',
    borderRadius: '99px',
    backgroundColor: '#F1F3F5',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#6C757D',
  },
  convoList: {
    flex: 1,
    overflowY: 'auto',
  },
  convoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    width: '100%',
    padding: '0.875rem 1.25rem',
    border: 'none',
    borderBottom: '1px solid #F8F9FA',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'inherit',
    transition: 'background-color 0.15s',
  },
  convoAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: '#F0FFF4',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  convoAvatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  convoInfo: {
    flex: 1,
    minWidth: 0,
  },
  convoTitleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.5rem',
    marginBottom: '0.2rem',
  },
  convoTitle: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#212529',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  unreadBadge: {
    flexShrink: 0,
    minWidth: '18px',
    height: '18px',
    borderRadius: '99px',
    backgroundColor: '#2ECC71',
    color: '#FFFFFF',
    fontSize: '0.6875rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 4px',
  },
  convoMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    fontSize: '0.75rem',
    color: '#6C757D',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    marginBottom: '0.2rem',
  },
  convoDate: {
    fontSize: '0.6875rem',
    color: '#ADB5BD',
  },
  convoPreview: {
    fontSize: '0.75rem',
    color: '#6C757D',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    marginTop: '1px',
  },
  convoTime: {
    fontSize: '0.6875rem',
    color: '#ADB5BD',
    flexShrink: 0,
  },

  /* ──── Chat Panel ──── */
  chatPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  chatHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #E9ECEF',
    backgroundColor: '#FFFFFF',
  },
  chatHeaderBack: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    border: 'none',
    borderRadius: '50%',
    backgroundColor: '#F8F9FA',
    cursor: 'pointer',
    color: '#495057',
    flexShrink: 0,
  },
  chatHeaderAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#F0FFF4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  chatHeaderAvatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  chatHeaderTitle: {
    fontWeight: 700,
    fontSize: '0.9375rem',
    color: '#212529',
    lineHeight: 1.2,
  },
  chatHeaderSub: {
    fontSize: '0.75rem',
    color: '#6C757D',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  interestNotice: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    alignSelf: 'center',
    padding: '0.375rem 0.875rem',
    backgroundColor: '#F0FFF4',
    border: '1px solid #C3F5D5',
    borderRadius: '99px',
    fontSize: '0.75rem',
    color: '#2D6A3F',
    fontWeight: 500,
    marginBottom: '0.5rem',
  },
  msgRow: {
    display: 'flex',
  },
  bubble: {
    maxWidth: '68%',
    padding: '0.625rem 0.875rem',
    borderRadius: '18px',
    wordBreak: 'break-word',
  },
  bubbleText: {
    margin: 0,
    fontSize: '0.9375rem',
    lineHeight: 1.45,
  },
  bubbleTime: {
    display: 'block',
    fontSize: '0.6875rem',
    marginTop: '0.25rem',
    textAlign: 'right',
  },
  inputBar: {
    display: 'flex',
    gap: '0.75rem',
    padding: '1rem 1.5rem',
    borderTop: '1px solid #E9ECEF',
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    padding: '0.625rem 0.875rem',
    border: '1.5px solid #DEE2E6',
    borderRadius: '0.75rem',
    fontSize: '0.9375rem',
    fontFamily: 'inherit',
    resize: 'none',
    outline: 'none',
    lineHeight: 1.5,
    backgroundColor: '#F8F9FA',
    color: '#212529',
  },
  sendBtn: {
    width: '44px',
    height: '44px',
    border: 'none',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'background-color 0.15s',
  },
  noSelection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    color: '#ADB5BD',
    fontSize: '0.9375rem',
  },
};

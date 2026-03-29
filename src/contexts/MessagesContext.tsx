/**
 * MessagesContext — tracks expressed interests and mock chat messages.
 *
 * When an investor expresses interest in a project, it's added here.
 * A mock auto-reply simulates the project owner responding.
 */

import React, { createContext, useContext, useReducer, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  text: string;
  from: 'investor' | 'owner';
  timestamp: Date;
  /** true once the owner has replied after this message */
  read?: boolean;
}

export interface ConversationEntry {
  projectId: string;
  projectTitle: string;
  projectType: string;
  region: string;
  budget: number;
  imageUrl?: string;
  proposedBudget?: number;
  interestMessage?: string;
  expressedAt: Date;
  messages: ChatMessage[];
  unread: number;
}

interface MessagesState {
  conversations: ConversationEntry[];
}

type MessagesAction =
  | {
      type: 'EXPRESS_INTEREST';
      payload: Omit<ConversationEntry, 'expressedAt' | 'messages' | 'unread'>;
    }
  | { type: 'SEND_MESSAGE'; payload: { projectId: string; message: ChatMessage } }
  | { type: 'MARK_READ'; payload: { projectId: string } }
  | { type: 'WITHDRAW_INTEREST'; payload: { projectId: string } };

function reducer(state: MessagesState, action: MessagesAction): MessagesState {
  switch (action.type) {
    case 'EXPRESS_INTEREST': {
      const exists = state.conversations.find(
        (c) => c.projectId === action.payload.projectId
      );
      if (exists) return state;
      const welcome: ChatMessage = {
        id: `msg-auto-${Date.now()}`,
        text: `Hello! Thank you for expressing interest in "${action.payload.projectTitle}".${action.payload.proposedBudget ? ` Your proposed budget of ${action.payload.proposedBudget.toLocaleString()} DZD has been noted.` : ''}${action.payload.interestMessage ? `\n\nYour message: "${action.payload.interestMessage}"` : ''} The project owner will review your interest and get back to you shortly. — ProdNet Team`,
        from: 'owner',
        timestamp: new Date(),
      };
      return {
        conversations: [
          {
            ...action.payload,
            expressedAt: new Date(),
            messages: [welcome],
            unread: 1,
          },
          ...state.conversations,
        ],
      };
    }
    case 'SEND_MESSAGE': {
      return {
        conversations: state.conversations.map((c) => {
          if (c.projectId !== action.payload.projectId) return c;
          const incoming = action.payload.message;
          // When owner replies, mark all prior investor messages as read
          const prevMessages =
            incoming.from === 'owner'
              ? c.messages.map((m) => (m.from === 'investor' ? { ...m, read: true } : m))
              : c.messages;
          return { ...c, messages: [...prevMessages, incoming], unread: 0 };
        }),
      };
    }
    case 'MARK_READ': {
      return {
        conversations: state.conversations.map((c) =>
          c.projectId === action.payload.projectId ? { ...c, unread: 0 } : c
        ),
      };
    }
    case 'WITHDRAW_INTEREST': {
      return {
        conversations: state.conversations.filter(
          (c) => c.projectId !== action.payload.projectId,
        ),
      };
    }
    default:
      return state;
  }
}

interface MessagesContextValue {
  conversations: ConversationEntry[];
  totalUnread: number;
  expressInterest: (entry: Omit<ConversationEntry, 'expressedAt' | 'messages' | 'unread'>) => void;
  sendMessage: (projectId: string, text: string) => void;
  markRead: (projectId: string) => void;
  hasInterest: (projectId: string) => boolean;
  withdrawInterest: (projectId: string) => void;
}

const MessagesContext = createContext<MessagesContextValue | null>(null);

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { conversations: [] });

  const expressInterest = useCallback(
    (entry: Omit<ConversationEntry, 'expressedAt' | 'messages' | 'unread'>) => {
      dispatch({ type: 'EXPRESS_INTEREST', payload: entry });
    },
    []
  );

  const sendMessage = useCallback((projectId: string, text: string) => {
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      text,
      from: 'investor',
      timestamp: new Date(),
    };
    dispatch({ type: 'SEND_MESSAGE', payload: { projectId, message: msg } });

    // Mock auto-reply after 1.5 s
    setTimeout(() => {
      const replies = [
        'Thank you for your message! We will review your interest and get back to you soon.',
        'Great to hear from you! We are currently reviewing interested investors.',
        'Thanks for reaching out. We will contact you with more details shortly.',
        'Hello! We appreciate your interest. Our team will be in touch.',
      ];
      const reply: ChatMessage = {
        id: `msg-auto-${Date.now()}`,
        text: replies[Math.floor(Math.random() * replies.length)],
        from: 'owner',
        timestamp: new Date(),
      };
      dispatch({ type: 'SEND_MESSAGE', payload: { projectId, message: reply } });
    }, 1500);
  }, []);

  const markRead = useCallback((projectId: string) => {
    dispatch({ type: 'MARK_READ', payload: { projectId } });
  }, []);

  const withdrawInterest = useCallback((projectId: string) => {
    dispatch({ type: 'WITHDRAW_INTEREST', payload: { projectId } });
  }, []);

  const hasInterest = useCallback(
    (projectId: string) => state.conversations.some((c) => c.projectId === projectId),
    [state.conversations]
  );

  const totalUnread = state.conversations.reduce((sum, c) => sum + c.unread, 0);

  return (
    <MessagesContext.Provider
      value={{ conversations: state.conversations, totalUnread, expressInterest, sendMessage, markRead, hasInterest, withdrawInterest }}
    >
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const ctx = useContext(MessagesContext);
  if (!ctx) throw new Error('useMessages must be used inside MessagesProvider');
  return ctx;
}

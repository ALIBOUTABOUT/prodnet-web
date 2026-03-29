/**
 * Expert Context — aligned with mobile app's expert_provider.dart patterns.
 *
 * README ref: "State Management Strategy > ExpertProvider"
 * Manages:
 *   - Expert ideas (CRUD + lifecycle: draft → published → readyForPilot → pilotActive)
 *   - Pilot project browsing and participation requests
 *   - Collaboration tracking
 *   - Saved (bookmarked) farmer projects
 *
 * README ref: "Expert Features > Idea Lifecycle"
 * README ref: "Expert Features > Browsing Farmer Projects"
 */

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {
  ExpertIdea,
  PilotProject,
  Collaboration,
  IdeaStatus,
  ExpertCategory,
  InvestorInterest,
} from '@/models/expertIdea';
import { useAuth } from '@/contexts/AuthContext';
import {
  MOCK_EXPERT_IDEAS,
  MOCK_PILOT_PROJECTS,
  MOCK_COLLABORATIONS,
} from '@/core/api/expertMockData';

// ── State ─────────────────────────────────────────

interface ExpertState {
  ideas: ExpertIdea[];
  pilotProjects: PilotProject[];
  collaborations: Collaboration[];
  savedProjectIds: string[];
  messages: ExpertMessage[];
  isLoading: boolean;
}

/** Expert messaging — aligned with mobile MessagingProvider */
export interface ExpertMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
  read: boolean;
}

export interface ExpertConversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: 'investor' | 'farmer';
  projectTitle?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

const MOCK_MESSAGES: ExpertMessage[] = [
  { id: 'msg-1', conversationId: 'conv-1', senderId: 'inv_1', senderName: 'Karim Benali', text: 'Hi, I reviewed the greenhouse proposal. Can we schedule a call this week?', createdAt: '2026-03-08T10:00:00Z', read: true },
  { id: 'msg-2', conversationId: 'conv-1', senderId: 'expert_1', senderName: 'You', text: 'Sure! I am available Thursday afternoon. Does 2pm work?', createdAt: '2026-03-08T10:30:00Z', read: true },
  { id: 'msg-3', conversationId: 'conv-1', senderId: 'inv_1', senderName: 'Karim Benali', text: 'Perfect. I will send a meeting link. Looking forward to it.', createdAt: '2026-03-08T11:00:00Z', read: false },
  { id: 'msg-4', conversationId: 'conv-2', senderId: 'farmer_2', senderName: 'Fatima Zeggane', text: 'The soil test results are back. Can you review them?', createdAt: '2026-03-07T15:00:00Z', read: true },
  { id: 'msg-5', conversationId: 'conv-2', senderId: 'expert_1', senderName: 'You', text: 'I will look at them tonight and share my recommendations.', createdAt: '2026-03-07T16:00:00Z', read: true },
  { id: 'msg-6', conversationId: 'conv-3', senderId: 'inv_2', senderName: 'Samira Haddad', text: 'We approved the solar pumping budget. When can we start?', createdAt: '2026-03-06T09:00:00Z', read: false },
];

const MOCK_CONVERSATIONS: ExpertConversation[] = [
  { id: 'conv-1', participantId: 'inv_1', participantName: 'Karim Benali', participantRole: 'investor', projectTitle: 'Sustainable Greenhouse Farming System', lastMessage: 'Perfect. I will send a meeting link.', lastMessageAt: '2026-03-08T11:00:00Z', unreadCount: 1 },
  { id: 'conv-2', participantId: 'farmer_2', participantName: 'Fatima Zeggane', participantRole: 'farmer', projectTitle: 'Oasis Date Palm Rehabilitation', lastMessage: 'I will look at them tonight.', lastMessageAt: '2026-03-07T16:00:00Z', unreadCount: 0 },
  { id: 'conv-3', participantId: 'inv_2', participantName: 'Samira Haddad', participantRole: 'investor', projectTitle: 'Low-Cost Solar Pumping for Remote Farms', lastMessage: 'We approved the solar pumping budget.', lastMessageAt: '2026-03-06T09:00:00Z', unreadCount: 1 },
];

const initialState: ExpertState = {
  ideas: MOCK_EXPERT_IDEAS,
  pilotProjects: MOCK_PILOT_PROJECTS,
  collaborations: MOCK_COLLABORATIONS,
  savedProjectIds: [],
  messages: MOCK_MESSAGES,
  isLoading: false,
};

// ── Actions ───────────────────────────────────────

type ExpertAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CREATE_IDEA'; payload: ExpertIdea }
  | { type: 'UPDATE_IDEA'; payload: ExpertIdea }
  | { type: 'DELETE_IDEA'; id: string }
  | { type: 'SET_IDEA_STATUS'; id: string; status: IdeaStatus }
  | { type: 'TOGGLE_PARTICIPATION'; projectId: string }
  | { type: 'REQUEST_COLLABORATION'; collaboration: Collaboration }
  | { type: 'TOGGLE_SAVE_PROJECT'; projectId: string }
  | { type: 'SEND_MESSAGE'; message: ExpertMessage }
  | { type: 'MARK_READ'; conversationId: string };

function expertReducer(state: ExpertState, action: ExpertAction): ExpertState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'CREATE_IDEA':
      return { ...state, ideas: [action.payload, ...state.ideas] };

    case 'UPDATE_IDEA':
      return {
        ...state,
        ideas: state.ideas.map((idea) =>
          idea.id === action.payload.id ? action.payload : idea,
        ),
      };

    case 'DELETE_IDEA':
      return { ...state, ideas: state.ideas.filter((idea) => idea.id !== action.id) };

    case 'SET_IDEA_STATUS':
      return {
        ...state,
        ideas: state.ideas.map((idea) =>
          idea.id === action.id ? { ...idea, status: action.status } : idea,
        ),
      };

    case 'TOGGLE_PARTICIPATION':
      return {
        ...state,
        pilotProjects: state.pilotProjects.map((p) =>
          p.id === action.projectId
            ? { ...p, isParticipating: !p.isParticipating }
            : p,
        ),
      };

    case 'REQUEST_COLLABORATION': {
      const exists = state.collaborations.find(
        (c) => c.projectId === action.collaboration.projectId,
      );
      if (exists) return state;
      return { ...state, collaborations: [action.collaboration, ...state.collaborations] };
    }

    case 'TOGGLE_SAVE_PROJECT': {
      const saved = state.savedProjectIds.includes(action.projectId);
      return {
        ...state,
        savedProjectIds: saved
          ? state.savedProjectIds.filter((id) => id !== action.projectId)
          : [...state.savedProjectIds, action.projectId],
      };
    }

    case 'SEND_MESSAGE':
      return { ...state, messages: [...state.messages, action.message] };

    case 'MARK_READ':
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.conversationId === action.conversationId ? { ...m, read: true } : m,
        ),
      };

    default:
      return state;
  }
}

// ── Context Interface ─────────────────────────────

interface ExpertContextValue extends ExpertState {
  // Ideas
  createIdea: (
    fields: Omit<ExpertIdea, 'id' | 'expertId' | 'expertName' | 'createdAt' | 'interestedInvestors' | 'isOwn'>
  ) => void;
  updateIdea: (idea: ExpertIdea) => void;
  deleteIdea: (id: string) => void;
  setIdeaStatus: (id: string, status: IdeaStatus) => void;
  publishIdea: (id: string) => void;
  getIdeaById: (id: string) => ExpertIdea | undefined;

  // Pilot projects
  toggleParticipation: (projectId: string) => void;
  getPilotProjectById: (id: string) => PilotProject | undefined;

  // Collaborations
  requestCollaboration: (project: PilotProject) => void;
  isCollaborating: (projectId: string) => boolean;

  // Saved projects
  toggleSaveProject: (projectId: string) => void;
  isProjectSaved: (projectId: string) => boolean;

  // Messaging
  conversations: ExpertConversation[];
  getMessagesForConversation: (conversationId: string) => ExpertMessage[];
  sendMessage: (conversationId: string, text: string) => void;
  markConversationRead: (conversationId: string) => void;
  totalUnreadMessages: number;

  // Stats (derived)
  totalIdeas: number;
  publishedIdeas: number;
  activePilots: number;
  activeCollaborations: number;
}

const ExpertContext = createContext<ExpertContextValue | null>(null);

// ── Provider ──────────────────────────────────────

export function ExpertProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(expertReducer, initialState);

  // Get auth user for linking expert identity
  let authUser: { id: string; fullName?: string } | null = null;
  try {
    const auth = useAuth();
    authUser = auth.user;
  } catch {
    // Not within AuthProvider during tests
  }

  // ── Ideas ───────────────────────────────────────

  const createIdea = useCallback(
    (
      fields: Omit<
        ExpertIdea,
        'id' | 'expertId' | 'expertName' | 'createdAt' | 'interestedInvestors' | 'isOwn'
      >,
    ) => {
      const newIdea: ExpertIdea = {
        ...fields,
        id: `ei-${Date.now()}`,
        expertId: authUser?.id || 'expert_1',
        expertName: authUser?.fullName || 'You',
        createdAt: new Date().toISOString(),
        interestedInvestors: 0,
        interests: [],
        isOwn: true,
      };
      dispatch({ type: 'CREATE_IDEA', payload: newIdea });
    },
    [],
  );

  const updateIdea = useCallback((idea: ExpertIdea) => {
    dispatch({ type: 'UPDATE_IDEA', payload: idea });
  }, []);

  const deleteIdea = useCallback((id: string) => {
    dispatch({ type: 'DELETE_IDEA', id });
  }, []);

  const setIdeaStatus = useCallback((id: string, status: IdeaStatus) => {
    dispatch({ type: 'SET_IDEA_STATUS', id, status });
  }, []);

  const publishIdea = useCallback((id: string) => {
    dispatch({ type: 'SET_IDEA_STATUS', id, status: 'published' });
  }, []);

  const getIdeaById = useCallback(
    (id: string) => state.ideas.find((idea) => idea.id === id),
    [state.ideas],
  );

  // ── Pilot Projects ──────────────────────────────

  const toggleParticipation = useCallback((projectId: string) => {
    dispatch({ type: 'TOGGLE_PARTICIPATION', projectId });
    // Also add a pending collaboration when joining
    const project = state.pilotProjects.find((p) => p.id === projectId);
    if (project && !project.isParticipating) {
      const collab: Collaboration = {
        id: `col-${Date.now()}`,
        projectId: project.id,
        projectTitle: project.title,
        farmerName: project.farmerName,
        farmerRegion: project.farmerRegion,
        status: 'pending',
        lastInteraction: new Date().toISOString(),
        category: project.category as ExpertCategory,
        description: `Participation request sent for "${project.title}". Awaiting farmer confirmation.`,
      };
      dispatch({ type: 'REQUEST_COLLABORATION', collaboration: collab });
    }
  }, [state.pilotProjects]);

  const getPilotProjectById = useCallback(
    (id: string) => state.pilotProjects.find((p) => p.id === id),
    [state.pilotProjects],
  );

  // ── Collaborations ──────────────────────────────

  const requestCollaboration = useCallback(
    (project: PilotProject) => {
      const collab: Collaboration = {
        id: `col-${Date.now()}`,
        projectId: project.id,
        projectTitle: project.title,
        farmerName: project.farmerName,
        farmerRegion: project.farmerRegion,
        status: 'pending',
        lastInteraction: new Date().toISOString(),
        category: project.category as ExpertCategory,
        description: `Collaboration request sent for "${project.title}".`,
      };
      dispatch({ type: 'REQUEST_COLLABORATION', collaboration: collab });
    },
    [],
  );

  const isCollaborating = useCallback(
    (projectId: string) => state.collaborations.some((c) => c.projectId === projectId),
    [state.collaborations],
  );

  // ── Saved Projects ──────────────────────────────

  const toggleSaveProject = useCallback((projectId: string) => {
    dispatch({ type: 'TOGGLE_SAVE_PROJECT', projectId });
  }, []);

  const isProjectSaved = useCallback(
    (projectId: string) => state.savedProjectIds.includes(projectId),
    [state.savedProjectIds],
  );

  // ── Messaging ───────────────────────────────────

  const conversations = MOCK_CONVERSATIONS;

  const getMessagesForConversation = useCallback(
    (conversationId: string) =>
      state.messages.filter((m) => m.conversationId === conversationId),
    [state.messages],
  );

  const sendMessage = useCallback(
    (conversationId: string, text: string) => {
      const msg: ExpertMessage = {
        id: `msg-${Date.now()}`,
        conversationId,
        senderId: authUser?.id || 'expert_1',
        senderName: 'You',
        text,
        createdAt: new Date().toISOString(),
        read: true,
      };
      dispatch({ type: 'SEND_MESSAGE', message: msg });
    },
    [authUser],
  );

  const markConversationRead = useCallback((conversationId: string) => {
    dispatch({ type: 'MARK_READ', conversationId });
  }, []);

  const totalUnreadMessages = state.messages.filter((m) => !m.read && m.senderId !== (authUser?.id || 'expert_1')).length;

  // ── Derived stats ───────────────────────────────

  const totalIdeas = state.ideas.length;
  const publishedIdeas = state.ideas.filter(
    (i) => i.status === 'published' || i.status === 'readyForPilot' || i.status === 'pilotActive',
  ).length;
  const activePilots = state.pilotProjects.filter((p) => p.isParticipating).length;
  const activeCollaborations = state.collaborations.filter((c) => c.status === 'active').length;

  return (
    <ExpertContext.Provider
      value={{
        ...state,
        createIdea,
        updateIdea,
        deleteIdea,
        setIdeaStatus,
        publishIdea,
        getIdeaById,
        toggleParticipation,
        getPilotProjectById,
        requestCollaboration,
        isCollaborating,
        toggleSaveProject,
        isProjectSaved,
        conversations,
        getMessagesForConversation,
        sendMessage,
        markConversationRead,
        totalUnreadMessages,
        totalIdeas,
        publishedIdeas,
        activePilots,
        activeCollaborations,
      }}
    >
      {children}
    </ExpertContext.Provider>
  );
}

export function useExpert(): ExpertContextValue {
  const ctx = useContext(ExpertContext);
  if (!ctx) throw new Error('useExpert must be used inside ExpertProvider');
  return ctx;
}

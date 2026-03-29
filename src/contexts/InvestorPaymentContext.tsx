/**
 * Investor Payment Context — aligned with mobile app's `investor_payment_provider.dart`
 *
 * README ref: "Premium Simulation Feature"
 * - UI-only simulation of a subscription paywall
 * - No real payment gateway, no backend interaction
 * - State managed entirely by InvestorPaymentProvider
 * - Persisted per-user in SharedPreferences (localStorage on web)
 *
 * README ref: "Before Premium (Free tier)"
 * - Browse full project feed ✓
 * - Express interest ✗ (locked)
 * - Messaging ✗ (locked)
 * - Contact details ✗ (locked)
 *
 * README ref: "After Premium (Pro tier)"
 * - All features unlocked
 * - Gold premium badge on avatar
 * - "PRO" label in drawer
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { StorageService } from '@/services/storageService';
import { useAuth } from './AuthContext';

// ── Subscription Plans ────────────────────────────

/**
 * README ref: "Unlocking Premium"
 * Monthly: 3,000 DZD/month
 * Yearly: 30,000 DZD/year (saves 6,000 DZD)
 */
export interface SubscriptionPlan {
  id: 'monthly' | 'yearly';
  label: string;
  price: number;
  originalPrice?: number;
  savings?: number;
  period: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly',
    label: 'Monthly',
    price: 3000,
    period: '/month',
  },
  {
    id: 'yearly',
    label: 'Yearly',
    price: 30000,
    originalPrice: 36000,
    savings: 6000,
    period: '/year',
  },
];

// ── State ─────────────────────────────────────────

interface PaymentState {
  isPremium: boolean;
  selectedPlan: SubscriptionPlan | null;
  isProcessing: boolean;
  paymentError: string | null;
}

const initialState: PaymentState = {
  isPremium: false,
  selectedPlan: null,
  isProcessing: false,
  paymentError: null,
};

// ── Actions ───────────────────────────────────────

type PaymentAction =
  | { type: 'SET_PREMIUM'; payload: boolean }
  | { type: 'SELECT_PLAN'; payload: SubscriptionPlan }
  | { type: 'PROCESSING'; payload: boolean }
  | { type: 'PAYMENT_ERROR'; payload: string }
  | { type: 'PAYMENT_SUCCESS' }
  | { type: 'RESET' };

function paymentReducer(state: PaymentState, action: PaymentAction): PaymentState {
  switch (action.type) {
    case 'SET_PREMIUM':
      return { ...state, isPremium: action.payload };
    case 'SELECT_PLAN':
      return { ...state, selectedPlan: action.payload, paymentError: null };
    case 'PROCESSING':
      return { ...state, isProcessing: action.payload, paymentError: null };
    case 'PAYMENT_ERROR':
      return { ...state, paymentError: action.payload, isProcessing: false };
    case 'PAYMENT_SUCCESS':
      return { ...state, isPremium: true, isProcessing: false, paymentError: null };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────

interface PaymentContextValue extends PaymentState {
  selectPlan: (plan: SubscriptionPlan) => void;
  processPayment: (cardNumber: string, expiry: string, cvv: string, cardHolder: string) => Promise<boolean>;
  resetPayment: () => void;
}

const PaymentContext = createContext<PaymentContextValue | null>(null);

export function InvestorPaymentProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(paymentReducer, initialState);
  const { user } = useAuth();

  /**
   * README ref: "State Loading"
   * On app startup, loadPaymentState(userId) restores premium status from storage.
   */
  useEffect(() => {
    if (user?.id) {
      const isPremium = StorageService.getInvestorPremiumStatus(user.id);
      dispatch({ type: 'SET_PREMIUM', payload: isPremium });
    } else {
      dispatch({ type: 'RESET' });
    }
  }, [user?.id]);

  const selectPlan = useCallback((plan: SubscriptionPlan) => {
    dispatch({ type: 'SELECT_PLAN', payload: plan });
  }, []);

  /**
   * README ref: "Unlocking Premium > On submission"
   * - 1,500ms simulated delay represents processing
   * - Any valid-format card → payment is approved
   * - On success, premium status saved to storage
   *
   * The README mentions a specific card number that triggers rejection,
   * but since we're not implementing real payment, all valid cards succeed.
   */
  const processPayment = useCallback(
    async (cardNumber: string, _expiry: string, _cvv: string, _cardHolder: string): Promise<boolean> => {
      dispatch({ type: 'PROCESSING', payload: true });

      // Simulate payment processing delay (1,500ms per README)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Check for test rejection card
      const digits = cardNumber.replace(/\s/g, '');
      if (digits === '4111111111111111') {
        dispatch({ type: 'PAYMENT_ERROR', payload: 'Payment declined. Please try a different card.' });
        return false;
      }

      // Payment approved
      if (user?.id) {
        StorageService.saveInvestorPremiumStatus(true, user.id);
      }
      dispatch({ type: 'PAYMENT_SUCCESS' });
      return true;
    },
    [user?.id],
  );

  const resetPayment = useCallback(() => {
    dispatch({ type: 'RESET' });
    if (user?.id) {
      const isPremium = StorageService.getInvestorPremiumStatus(user.id);
      dispatch({ type: 'SET_PREMIUM', payload: isPremium });
    }
  }, [user?.id]);

  return (
    <PaymentContext.Provider
      value={{
        ...state,
        selectPlan,
        processPayment,
        resetPayment,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function useInvestorPayment(): PaymentContextValue {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('useInvestorPayment must be used within an InvestorPaymentProvider');
  }
  return context;
}

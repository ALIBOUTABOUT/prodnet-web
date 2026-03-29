/**
 * Payment Simulation Screen — aligned with mobile app's `payment_simulation_screen.dart`
 *
 * README ref: "Premium Simulation Feature > Unlocking Premium"
 * 1. Investor taps upgrade banner → navigated to payment screen
 * 2. Screen displays two subscription plans:
 *    - Monthly: 3,000 DZD/month
 *    - Yearly: 30,000 DZD/year (saves 6,000 DZD — highlighted with SAVE badge)
 * 3. Investor selects a plan, then fills simulated CB (Carte Bancaire) form:
 *    - Card Number (16 digits, formatted with spaces)
 *    - Card Holder Name
 *    - Expiry Date
 *    - CVV
 * 4. On submission:
 *    - 1,500ms simulated delay
 *    - Specific test card → payment rejected
 *    - Any other valid card → payment approved
 * 5. On success → payment_success_screen
 *
 * Premium features list shown:
 *   - Direct messaging with owners
 *   - Express interest in projects
 *   - View owner contact details
 *   - Premium investor badge
 */

import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvestorPayment, SUBSCRIPTION_PLANS, SubscriptionPlan } from '@/contexts/InvestorPaymentContext';
import { Validators } from '@/core/validators';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { formatBudget } from '@/models/project';
import {
  Crown,
  CreditCard,
  MessageCircle,
  Heart,
  User,
  Award,
  CheckCircle,
  Shield,
  ArrowLeft,
} from 'lucide-react';

const PREMIUM_FEATURES = [
  { icon: <MessageCircle size={20} />, label: 'Direct messaging with owners' },
  { icon: <Heart size={20} />, label: 'Express interest in projects' },
  { icon: <User size={20} />, label: 'View owner contact details' },
  { icon: <Award size={20} />, label: 'Premium investor badge' },
];

export function PaymentSimulationPage() {
  const { selectPlan, processPayment, selectedPlan, isProcessing, paymentError, isPremium } =
    useInvestorPayment();
  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [validationError, setValidationError] = useState('');

  if (isPremium) {
    return (
      <div style={styles.page}>
        <div style={styles.alreadyPremium}>
          <Crown size={48} style={{ color: '#F1C40F' }} />
          <h2>You're already Premium!</h2>
          <p>All features are unlocked. Enjoy the full ProdNet experience.</p>
          <button onClick={() => navigate('/investor')} style={styles.backBtn}>
            Go to Feed
          </button>
        </div>
      </div>
    );
  }

  const handleCardNumberChange = (value: string) => {
    setCardNumber(Validators.formatCardNumber(value));
  };

  const handleExpiryChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      setExpiry(`${digits.slice(0, 2)}/${digits.slice(2)}`);
    } else {
      setExpiry(digits);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!selectedPlan) {
      setValidationError('Please select a subscription plan.');
      return;
    }
    if (!Validators.isValidCardNumber(cardNumber)) {
      setValidationError('Please enter a valid 16-digit card number.');
      return;
    }
    if (!Validators.isNotEmpty(cardHolder)) {
      setValidationError('Please enter the card holder name.');
      return;
    }
    if (!Validators.isValidExpiry(expiry)) {
      setValidationError('Please enter a valid expiry date (MM/YY).');
      return;
    }
    if (!Validators.isValidCVV(cvv)) {
      setValidationError('Please enter a valid 3-digit CVV.');
      return;
    }

    const success = await processPayment(cardNumber, expiry, cvv, cardHolder);
    if (success) {
      navigate('/investor/payment-success');
    }
  };

  const monthlyPlan = SUBSCRIPTION_PLANS.find((p) => p.id === 'monthly')!;
  const yearlyPlan = SUBSCRIPTION_PLANS.find((p) => p.id === 'yearly')!;

  return (
    <div style={styles.page}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <button onClick={() => navigate(-1)} style={styles.backArrow}>
          <ArrowLeft size={22} />
        </button>
        <span style={styles.topBarTitle}>Unlock Premium Access</span>
        <div style={{ width: '40px' }} />
      </div>

      {/* ── Green Hero Section ── */}
      <div style={styles.hero}>
        <div style={styles.heroBadge}>
          <Crown size={36} style={{ color: '#FFFFFF' }} />
        </div>
        <h1 style={styles.heroTitle}>Investor Premium</h1>
        <p style={styles.heroDesc}>
          Unlock full access to contact owners,<br />send messages and express interest.
        </p>

        {/* Plan Cards */}
        <div style={styles.plansRow}>
          {/* Monthly */}
          <button
            onClick={() => selectPlan(monthlyPlan)}
            style={{
              ...styles.planCard,
              backgroundColor: selectedPlan?.id === 'monthly' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)',
              borderColor: selectedPlan?.id === 'monthly' ? '#FFFFFF' : 'rgba(255,255,255,0.2)',
              borderWidth: selectedPlan?.id === 'monthly' ? '3px' : '2px',
              transform: selectedPlan?.id === 'monthly' ? 'scale(1.03)' : 'scale(1)',
              boxShadow: selectedPlan?.id === 'monthly' ? '0 4px 20px rgba(0,0,0,0.18)' : 'none',
            }}
          >
            <span style={styles.planLabel}>Monthly</span>
            <span style={styles.planAmount}>3,000</span>
            <span style={styles.planUnit}>DZD / month</span>
          </button>

          {/* Yearly */}
          <button
            onClick={() => selectPlan(yearlyPlan)}
            style={{
              ...styles.planCardYearly,
              borderColor: selectedPlan?.id === 'yearly' ? '#2ECC71' : '#E9ECEF',
              borderWidth: selectedPlan?.id === 'yearly' ? '3px' : '2px',
              boxShadow: selectedPlan?.id === 'yearly'
                ? '0 4px 20px rgba(46,204,113,0.25)'
                : '0 2px 12px rgba(0,0,0,0.06)',
              transform: selectedPlan?.id === 'yearly' ? 'scale(1.03)' : 'scale(1)',
              backgroundColor: selectedPlan?.id === 'yearly' ? '#F0FFF4' : '#FFFFFF',
            }}
          >
            <div style={styles.saveBadge}>SAVE 6,000</div>
            <span style={styles.yearlyLabel}>Yearly</span>
            <span style={styles.yearlyOriginal}>36,000</span>
            <span style={styles.yearlyAmount}>30,000</span>
            <span style={styles.yearlyUnit}>DZD / year</span>
          </button>
        </div>
      </div>

      {/* ── Features List ── */}
      <div style={styles.featuresSection}>
        {PREMIUM_FEATURES.map((f, i) => (
          <div key={i} style={styles.featureRow}>
            <div style={styles.featureIcon}>{f.icon}</div>
            <span style={styles.featureLabel}>{f.label}</span>
            <CheckCircle size={22} style={{ color: '#2ECC71', marginLeft: 'auto', flexShrink: 0 }} />
          </div>
        ))}
      </div>

      {/* ── CB Payment Form ── */}
      <div style={styles.paymentSection}>
        <div style={styles.paymentHeader}>
          <CreditCard size={20} style={{ color: '#495057' }} />
          <span style={styles.paymentTitle}>CB Payment (Carte Bancaire)</span>
        </div>
        <p style={styles.paymentSubtitle}>
          <Shield size={14} style={{ color: '#ADB5BD' }} />
          Simulated — no real charges
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Card Number</label>
            <div style={styles.inputWrapper}>
              <CreditCard size={16} style={styles.inputIcon} />
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                maxLength={19}
                style={styles.inputWithIcon}
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Card Holder</label>
            <input
              type="text"
              placeholder="Full name on card"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.fieldRow}>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Expiry</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => handleExpiryChange(e.target.value)}
                maxLength={5}
                style={styles.input}
              />
            </div>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>CVV</label>
              <input
                type="text"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                maxLength={3}
                style={styles.input}
              />
            </div>
          </div>

          {(validationError || paymentError) && (
            <div style={styles.errorBox}>{validationError || paymentError}</div>
          )}

          <button
            type="submit"
            disabled={isProcessing || !selectedPlan}
            style={{
              ...styles.submitBtn,
              opacity: isProcessing || !selectedPlan ? 0.7 : 1,
            }}
          >
            {isProcessing ? (
              <LoadingSpinner size={20} color="#FFF" compact />
            ) : (
              <>Pay {selectedPlan ? formatBudget(selectedPlan.price) : ''}</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: 'calc(100vh - 60px)',
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1rem',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #F1F3F5',
  },
  backArrow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#212529',
    cursor: 'pointer',
  },
  topBarTitle: {
    fontSize: '1.0625rem',
    fontWeight: 700,
    color: '#212529',
  },
  /* ── Hero ── */
  hero: {
    background: 'linear-gradient(180deg, #2D6A3F 0%, #3C8C54 100%)',
    padding: '2.5rem 1.5rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  heroBadge: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.18)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
    border: '3px solid rgba(255,255,255,0.25)',
  },
  heroTitle: {
    margin: '0 0 0.5rem',
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#FFFFFF',
  },
  heroDesc: {
    margin: '0 0 1.75rem',
    fontSize: '0.9375rem',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 1.5,
  },
  plansRow: {
    display: 'flex',
    gap: '1rem',
    width: '100%',
    maxWidth: '420px',
  },
  planCard: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1.25rem 0.75rem',
    border: '2px solid',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.15s',
  },
  planLabel: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: '0.375rem',
  },
  planAmount: {
    fontSize: '1.75rem',
    fontWeight: 800,
    color: '#FFFFFF',
    lineHeight: 1.1,
  },
  planUnit: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.65)',
    marginTop: '0.125rem',
  },
  planCardYearly: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1.25rem 0.75rem',
    border: '2px solid',
    borderRadius: '0.75rem',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.15s',
  },
  saveBadge: {
    position: 'absolute',
    top: '-10px',
    right: '-6px',
    padding: '2px 8px',
    borderRadius: '6px',
    backgroundColor: '#F39C12',
    color: '#FFFFFF',
    fontSize: '0.625rem',
    fontWeight: 700,
    letterSpacing: '0.03em',
  },
  yearlyLabel: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: '#2D6A3F',
    marginBottom: '0.125rem',
  },
  yearlyOriginal: {
    fontSize: '0.75rem',
    color: '#ADB5BD',
    textDecoration: 'line-through',
  },
  yearlyAmount: {
    fontSize: '1.75rem',
    fontWeight: 800,
    color: '#212529',
    lineHeight: 1.1,
  },
  yearlyUnit: {
    fontSize: '0.75rem',
    color: '#6C757D',
    marginTop: '0.125rem',
  },
  /* ── Features ── */
  featuresSection: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  },
  featureRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    padding: '1rem 0',
    borderBottom: '1px solid #F1F3F5',
  },
  featureIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '0.5rem',
    backgroundColor: '#F0FAF4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#2ECC71',
    flexShrink: 0,
  },
  featureLabel: {
    fontSize: '0.9375rem',
    color: '#212529',
    fontWeight: 500,
  },
  /* ── Payment Form ── */
  paymentSection: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '0 1.5rem 2.5rem',
  },
  paymentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    marginBottom: '0.25rem',
    paddingTop: '0.5rem',
    borderTop: '1px solid #DEE2E6',
  },
  paymentTitle: {
    fontSize: '1.0625rem',
    fontWeight: 700,
    color: '#212529',
  },
  paymentSubtitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    margin: '0 0 1.25rem',
    fontSize: '0.8125rem',
    color: '#ADB5BD',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.125rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
  },
  fieldRow: {
    display: 'flex',
    gap: '1rem',
  },
  label: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: '#495057',
  },
  inputWrapper: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#ADB5BD',
    pointerEvents: 'none' as const,
  },
  inputWithIcon: {
    width: '100%',
    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
    border: '1.5px solid #DEE2E6',
    borderRadius: '0.5rem',
    fontSize: '0.9375rem',
    color: '#212529',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
  },
  input: {
    padding: '0.75rem',
    border: '1.5px solid #DEE2E6',
    borderRadius: '0.5rem',
    fontSize: '0.9375rem',
    color: '#212529',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
    width: '100%',
  },
  errorBox: {
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    backgroundColor: '#FDE8E8',
    color: '#E74C3C',
    fontSize: '0.8125rem',
    fontWeight: 500,
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    height: '3rem',
    padding: '0 1.25rem',
    border: 'none',
    borderRadius: '0.5rem',
    backgroundColor: '#2ECC71',
    color: '#FFFFFF',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'opacity 0.15s',
  },
  alreadyPremium: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '4rem',
    gap: '0.75rem',
    color: '#212529',
    minHeight: 'calc(100vh - 60px)',
  },
  backBtn: {
    marginTop: '0.5rem',
    padding: '0.625rem 1.5rem',
    border: 'none',
    borderRadius: '0.5rem',
    backgroundColor: '#2ECC71',
    color: '#FFFFFF',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
};

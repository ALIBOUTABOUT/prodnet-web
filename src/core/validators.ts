/**
 * Input Validators — aligned with mobile app's `validators.dart`
 *
 * README ref: "Authentication Flow Summary"
 * Used for form validation in login, signup, and profile completion.
 */

export const Validators = {
  /** Validate email format */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /** Validate password: minimum 6 characters */
  isValidPassword(password: string): boolean {
    return password.length >= 6;
  },

  /** Validate non-empty field */
  isNotEmpty(value: string): boolean {
    return value.trim().length > 0;
  },

  /**
   * README ref: "Premium Simulation Feature"
   * Validate CB (Carte Bancaire) card number: 16 digits
   */
  isValidCardNumber(cardNumber: string): boolean {
    const digitsOnly = cardNumber.replace(/\s/g, '');
    return /^\d{16}$/.test(digitsOnly);
  },

  /** Validate CVV: 3 digits */
  isValidCVV(cvv: string): boolean {
    return /^\d{3}$/.test(cvv);
  },

  /** Validate expiry date: MM/YY format */
  isValidExpiry(expiry: string): boolean {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    const [month] = expiry.split('/').map(Number);
    return month >= 1 && month <= 12;
  },

  /** Format card number with spaces every 4 digits */
  formatCardNumber(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  },
};

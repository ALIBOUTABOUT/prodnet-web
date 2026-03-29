/**
 * Theme & Style Constants — aligned with mobile app's `styles.dart`
 *
 * ProdNet brand colors derived from the logo:
 * - Primary green (#2ECC71 / #27AE60)
 * - Accent silver/grey for secondary elements
 * - Amber/Gold for premium features
 */

export const theme = {
  colors: {
    primary: '#2ECC71',
    primaryDark: '#27AE60',
    primaryLight: '#A9DFBF',
    secondary: '#6C757D',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    textPrimary: '#212529',
    textSecondary: '#6C757D',
    textLight: '#ADB5BD',
    border: '#DEE2E6',
    error: '#E74C3C',
    warning: '#F39C12',
    success: '#2ECC71',
    info: '#3498DB',

    // README ref: "Unified Content Feed" badge colors
    expertIdea: '#3498DB',       // Blue badge
    pilotProject: '#2ECC71',     // Green badge
    farmerProject: '#F39C12',    // Orange badge

    // README ref: "Premium Simulation Feature" — gold/amber premium
    premiumGold: '#F1C40F',
    premiumAmber: '#F39C12',
    premiumBanner: '#FFF3E0',
  },

  fonts: {
    family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },

  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

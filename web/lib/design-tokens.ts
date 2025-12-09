/**
 * Design Tokens - Based on Figma Design Specifications
 * AUBH CarShare Mobile App UI
 * 
 * These tokens ensure consistency with the Figma design across all components
 */

export const colors = {
  // Brand Colors
  primary: '#DC143C',
  primaryDark: '#8B0000',
  primaryGradient: 'linear-gradient(180deg, #DC143C 0%, #8B0000 100%)',
  
  // Background Colors
  background: {
    primary: 'linear-gradient(180deg, #0A0E1A 0%, #1A1D29 50%, #2A1A1A 100%)',
    secondary: '#101828',
    tertiary: '#1A1D29',
    card: '#1E2939',
    black: '#000000',
  },
  
  // Border Colors
  border: {
    default: '#364153',
    light: 'rgba(255, 255, 255, 0.1)',
    primary: 'rgba(220, 20, 60, 0.3)',
    dark: '#1E2939',
  },
  
  // Text Colors
  text: {
    primary: '#FFFFFF',
    secondary: '#D1D5DC',
    tertiary: '#99A1AF',
    muted: '#6A7282',
    error: '#DC143C',
  },
  
  // Overlay Colors
  overlay: {
    light: 'rgba(255, 255, 255, 0.05)',
    red: 'rgba(220, 20, 60, 0.1)',
    redBorder: 'rgba(220, 20, 60, 0.3)',
    blur: 'rgba(220, 20, 60, 0.3)',
  },
} as const;

export const typography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  
  // Font Sizes
  size: {
    xs: '14px',
    sm: '16px',
    base: '18px',
    lg: '24px',
    xl: '36px',
    '2xl': '60px',
  },
  
  // Line Heights
  lineHeight: {
    tight: '18px',
    normal: '24px',
    relaxed: '26px',
    loose: '28px',
    xl: '36px',
    '2xl': '60px',
  },
  
  // Font Weights
  weight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  // Letter Spacing
  letterSpacing: {
    tight: '-0.439453px',
    normal: '0px',
    wide: '0.263672px',
    wider: '0.369141px',
  },
} as const;

export const borderRadius = {
  none: '0px',
  sm: '9px',
  md: '15.25px',
  lg: '18px',
  xl: '27px',
  '2xl': '45px',
  '3xl': '54px',
  full: '9999px',
} as const;

export const spacing = {
  xs: '4.5px',
  sm: '9px',
  md: '13.5px',
  lg: '18px',
  xl: '27px',
  '2xl': '36px',
  '3xl': '45px',
} as const;

export const shadows = {
  sm: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)',
  md: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
  none: 'none',
} as const;

export const screens = {
  // iPhone 16 Pro Max dimensions
  mobile: {
    width: '430px',
    height: '932px',
  },
  frame: {
    width: '463px',
    height: '965px',
    border: '3px',
  },
} as const;

export const layout = {
  // Container sizes
  container: {
    maxWidth: '430px',
    padding: spacing.xl,
  },
  
  // Input dimensions
  input: {
    height: '63px',
    padding: `${spacing.xs} ${spacing.md}`,
  },
  
  // Button dimensions
  button: {
    height: '72px',
    heightSmall: '45px',
  },
  
  // Icon sizes
  icon: {
    sm: '27px',
    md: '36px',
    lg: '72px',
    xl: '108px',
  },
} as const;

/**
 * Utility function to create a CSS variable-based theme
 * Use this in globals.css or component styles
 */
export const cssVars = {
  '--color-primary': colors.primary,
  '--color-primary-dark': colors.primaryDark,
  '--color-bg-primary': colors.background.primary,
  '--color-bg-secondary': colors.background.secondary,
  '--color-bg-card': colors.background.card,
  '--color-border': colors.border.default,
  '--color-text-primary': colors.text.primary,
  '--color-text-secondary': colors.text.secondary,
  '--font-family': typography.fontFamily,
  '--border-radius-lg': borderRadius.lg,
  '--spacing-md': spacing.md,
  '--shadow-md': shadows.md,
} as const;

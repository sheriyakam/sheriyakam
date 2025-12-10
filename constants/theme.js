const SHADES = {
    primary: '#0056b3',
    accent: '#2563eb', // Vibrant Blue
    accentGlow: 'rgba(37, 99, 235, 0.4)',
    gold: '#D4AF37',
    danger: '#ef4444',
    success: '#22c55e',
};

export const darkTheme = {
    bgPrimary: '#09090b',
    bgSecondary: '#18181b',
    bgTertiary: '#27272a',
    primary: SHADES.primary,
    textPrimary: '#ffffff',
    textSecondary: '#a1a1aa',
    textTertiary: '#71717a',
    accent: SHADES.accent,
    accentGlow: SHADES.accentGlow,
    gold: SHADES.gold,
    border: '#27272a',
    danger: SHADES.danger,
    success: SHADES.success,
    mode: 'dark',
};

export const lightTheme = {
    bgPrimary: '#ffffff',
    bgSecondary: '#f8f9fa',
    bgTertiary: '#e9ecef',
    primary: SHADES.primary,
    textPrimary: '#1a1a1a',
    textSecondary: '#4a4a4a',
    textTertiary: '#6c757d',
    accent: SHADES.accent,
    accentGlow: 'rgba(37, 99, 235, 0.2)',
    gold: SHADES.gold,
    border: '#dee2e6',
    danger: SHADES.danger,
    success: SHADES.success,
    mode: 'light',
};

// Default export for backward compatibility
export const COLORS = darkTheme;

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    25: 100,
};
